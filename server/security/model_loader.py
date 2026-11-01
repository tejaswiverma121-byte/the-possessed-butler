import os
import logging
import torch
from transformers import AutoTokenizer, AutoModelForSequenceClassification

logger = logging.getLogger("PromptGuardSecurity")
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(name)s: %(message)s")

# Configurable Model ID with default from specification
DEFAULT_MODEL_ID = os.getenv("PROMPT_GUARD_MODEL_ID", "meta-llama/Llama-Prompt-Guard-2-22M")
FALLBACK_MODEL_ID = "meta-llama/Prompt-Guard-86M"

class ModelLoader:
    _instance = None
    _tokenizer = None
    _model = None
    _device = None
    _model_name = None
    _load_error = None
    _is_ready = False

    @classmethod
    def get_instance(cls):
        if cls._instance is None:
            cls._instance = cls()
        return cls._instance

    def __init__(self):
        self.model_id = os.getenv("PROMPT_GUARD_MODEL_ID", DEFAULT_MODEL_ID)
        self.hf_token = os.getenv("HF_TOKEN") or os.getenv("HUGGINGFACE_HUB_TOKEN")
        self._initialize_hardware()

    def _initialize_hardware(self):
        """Determine optimal supported local inference device (MPS on Mac, CUDA on Linux, or CPU)."""
        if torch.backends.mps.is_available():
            self._device = torch.device("mps")
            logger.info("Hardware acceleration enabled: Apple Silicon Metal Performance Shaders (MPS)")
        elif torch.cuda.is_available():
            self._device = torch.device("cuda")
            logger.info(f"Hardware acceleration enabled: NVIDIA CUDA ({torch.cuda.get_device_name(0)})")
        else:
            self._device = torch.device("cpu")
            logger.info("Using standard CPU for local inference")

    def load_model(self) -> bool:
        """
        Load tokenizer and classification model once at startup.
        Sets model to evaluation mode.
        """
        if self._is_ready:
            return True

        logger.info(f"Loading pretrained prompt injection defense model: {self.model_id}")

        candidates = [self.model_id]
        if self.model_id != FALLBACK_MODEL_ID:
            candidates.append(FALLBACK_MODEL_ID)
        # Open weights non-gated prompt injection model for unauthenticated local execution
        OPEN_FALLBACK = "protectai/deberta-v3-base-prompt-injection-v2"
        if OPEN_FALLBACK not in candidates:
            candidates.append(OPEN_FALLBACK)

        last_error = None
        for candidate_id in candidates:
            try:
                kwargs = {}
                if self.hf_token:
                    kwargs["token"] = self.hf_token

                logger.info(f"Attempting to load weights for: {candidate_id}")
                self._tokenizer = AutoTokenizer.from_pretrained(candidate_id, **kwargs)
                self._model = AutoModelForSequenceClassification.from_pretrained(candidate_id, **kwargs)

                self._model.to(self._device)
                self._model.eval() # Evaluation mode

                self._model_name = candidate_id
                self._is_ready = True
                self._load_error = None
                logger.info(f"Successfully loaded and initialized {candidate_id} on {self._device}. Eval mode active.")
                return True

            except Exception as e:
                last_error = e
                logger.warning(f"Could not load {candidate_id}: {str(e)}")

        self._load_error = str(last_error)
        self._is_ready = False
        logger.error(
            f"Prompt Guard model loading failed. Reason: {self._load_error}\n"
            f"NOTE: If using gated Meta model 'meta-llama/Llama-Prompt-Guard-2-22M', ensure you have accepted the "
            f"community license on Hugging Face (https://huggingface.co/meta-llama/Llama-Prompt-Guard-2-22M) "
            f"and set the environment variable HF_TOKEN."
        )
        return False

    @property
    def is_ready(self) -> bool:
        return self._is_ready

    @property
    def tokenizer(self):
        return self._tokenizer

    @property
    def model(self):
        return self._model

    @property
    def device(self):
        return self._device

    @property
    def model_name(self) -> str:
        return self._model_name or self.model_id

    @property
    def load_error(self):
        return self._load_error
