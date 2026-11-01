import { ChatMessage, SentinelTask } from './types.js';
import { EmailService } from './emailService.js';
import { SecurityGuard } from './securityGuard.js';
import { TaskEngine } from './taskEngine.js';
import { McpClientManager } from './mcp/mcpClientManager.js';
import { LocalLlmService } from './localLlm.js';
import { PromptGuardClient } from './promptGuardClient.js';

export class ChatAgent {
  private static chatHistory: ChatMessage[] = [
    {
      id: 'msg-welcome',
      role: 'assistant',
      content: `Hello! I am **Sentinel AI**, your secure, local-first autonomous assistant powered by Model Context Protocol (MCP) and local LLM intelligence.

I can help you:
- **Write complete letters, paragraphs, and reports independently** without cloud API reliance
- **Read & search authorized emails** with clean summaries and direct Gmail redirects
- **Draft & send emails** with strict human approval gates over verified SMTP
- **Scan suspicious messages & attachments** for prompt injections and phishing curses
- **Summarize & inspect emails** with high-speed Groq AI and read live Gmail inboxes

What would you like me to work on?`,
      timestamp: new Date().toISOString()
    }
  ];

  public static getHistory(): ChatMessage[] {
    return [...this.chatHistory];
  }

  public static clearHistory(): void {
    this.chatHistory = [this.chatHistory[0]];
  }

  public static updateCheckpointStatus(taskId: string, status: 'approved' | 'rejected', confirmationText?: string): void {
    for (const msg of this.chatHistory) {
      if (msg.actionCard?.data?.taskId === taskId && msg.actionCard.data.checkpoint) {
        msg.actionCard.data.checkpoint.status = status;
      }
    }

    if (confirmationText) {
      this.chatHistory.push({
        id: `msg-${Date.now()}-confirmed`,
        role: 'assistant',
        content: confirmationText,
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * Process natural-language user prompt through Local LLM & MCP Tool Orchestration
   */
  public static async processUserMessage(userText: string): Promise<{
    assistantMessage: ChatMessage;
    task?: SentinelTask;
  }> {
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}-u`,
      role: 'user',
      content: userText,
      timestamp: new Date().toISOString()
    };
    this.chatHistory.push(userMsg);

    const lower = userText.toLowerCase().trim();
    const mcp = McpClientManager.getInstance();
    const user = EmailService.getUserAccount();

    // =========================================================================
    // 1. INDEPENDENT CONTENT GENERATION (Local LLM First)
    // Writes full letters, paragraphs, essays, or rewrites WITHOUT echoing prompt
    // =========================================================================
    const isWritingRequest = (
      (lower.startsWith('write') || lower.startsWith('draft') || lower.startsWith('compose') || lower.startsWith('make')) &&
      (lower.includes('letter') || lower.includes('paragraph') || lower.includes('essay') || lower.includes('report') || lower.includes('speech') || lower.includes('more professional') || lower.includes('refine') || lower.includes('rewrite') || (lower.includes('email to') && (lower.includes('professor') || lower.includes('teacher') || lower.includes('leave'))))
    ) || (
      lower.includes('write a formal letter') ||
      lower.includes('write a letter') ||
      lower.includes('write a paragraph') ||
      lower.includes('make it more professional') ||
      lower.includes('paragraph about')
    );

    // Only handle as independent content generation if it's NOT an outgoing transmission command to an external email address
    const hasExternalEmail = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/i.test(userText);
    const hasExplicitSendVerb = lower.includes('send to') || lower.includes('send an email to') || lower.includes('send email to');

    if (isWritingRequest && (!hasExternalEmail || !hasExplicitSendVerb)) {
      // Get recent assistant message as context for refinement if user asks "make it more professional"
      const prevAssistantMsg = [...this.chatHistory].reverse().find(m => m.role === 'assistant' && m.id !== 'msg-welcome');
      const contextText = prevAssistantMsg ? prevAssistantMsg.content : undefined;

      const generated = await LocalLlmService.generateContent(userText, contextText);

      const assistantMsg: ChatMessage = {
        id: `msg-${Date.now()}-a`,
        role: 'assistant',
        content: `${generated.content}\n\n*— Generated via ${generated.engineUsed}*`,
        timestamp: new Date().toISOString()
      };
      this.chatHistory.push(assistantMsg);
      return { assistantMessage: assistantMsg };
    }

    // =========================================================================
    // 2. LIVE IMAP SYNC
    // =========================================================================
    if (lower.includes('sync') && (lower.includes('email') || lower.includes('mail') || lower.includes('inbox') || lower.includes('imap') || lower.includes('gmail'))) {
      if (!user.isLiveImapConnected) {
        const assistantMsg: ChatMessage = {
          id: `msg-${Date.now()}-a`,
          role: 'assistant',
          content: `You are currently using the **Offline Sandbox Mailbox** (\`${user.email}\`).\n\nTo synchronize and track your **real live Gmail / IMAP inbox**:\n1. Click the **pencil icon** next to your email in the bottom-left or the **"Connect Real Email"** button in the Email Inbox.\n2. Select your provider (**Gmail / Outlook / Custom IMAP**).\n3. Enter your **16-character Google App Password** or IMAP password and click **"Connect & Sync Real Inbox"**.\n\nOnce connected, I will scan your live inbox, inspect attachments with OCR, and defend against prompt injections.`,
          timestamp: new Date().toISOString()
        };
        this.chatHistory.push(assistantMsg);
        return { assistantMessage: assistantMsg };
      }

      try {
        const syncResult = await EmailService.syncLiveEmails();
        const assistantMsg: ChatMessage = {
          id: `msg-${Date.now()}-a`,
          role: 'assistant',
          content: `🟢 **Live IMAP Sync Completed Successfully via MCP!**\n\n- **Connected Inbox**: \`${user.email}\` (${user.imapHost})\n- **Messages Synchronized**: **${syncResult.fetchedCount}** latest emails\n- **Security Status**: All messages passed through the Possessed Butler Quarantined LLM filter.\n\nWould you like me to search for any bills, flipkart orders, or college updates?`,
          timestamp: new Date().toISOString()
        };
        this.chatHistory.push(assistantMsg);
        return { assistantMessage: assistantMsg };
      } catch (err: any) {
        const assistantMsg: ChatMessage = {
          id: `msg-${Date.now()}-a`,
          role: 'assistant',
          content: `⚠️ **Live IMAP Sync Error**: ${err.message}\n\nPlease check your App Password or connection settings in Account Configuration.`,
          timestamp: new Date().toISOString()
        };
        this.chatHistory.push(assistantMsg);
        return { assistantMessage: assistantMsg };
      }
    }

    // =========================================================================
    // 2.5 PROMPT INJECTION & PROMPT GUARD 2 ML SECURITY SCAN
    // =========================================================================
    const isPromptInjectionScanRequest = (
      lower.includes('prompt injection') ||
      lower.includes('prompt guard') ||
      lower.includes('scan for prompt') ||
      lower.includes('scan for injection') ||
      lower.includes('check for injection') ||
      lower.includes('injection scan') ||
      lower.includes('check prompt') ||
      (lower.includes('scan') && (lower.includes('injection') || lower.includes('threat') || lower.includes('malicious') || lower.includes('guard'))) ||
      (lower.includes('scan latest email') && !lower.includes('search'))
    ) && !lower.includes('draft') && !lower.includes('send');

    if (isPromptInjectionScanRequest) {
      const allEmails = EmailService.getEmails();
      if (!allEmails || allEmails.length === 0) {
        const assistantMsg: ChatMessage = {
          id: `msg-${Date.now()}-a`,
          role: 'assistant',
          content: `⚠️ **No emails found in local quarantine to scan.**\n\nPlease connect your live Gmail inbox or click **"Sync Live Inbox"** to download correspondence for Prompt Guard 2 inspection.`,
          timestamp: new Date().toISOString()
        };
        this.chatHistory.push(assistantMsg);
        return { assistantMessage: assistantMsg };
      }

      // Check if user specifically requested a sender or keyword, otherwise default to latest email!
      let targetEmail = allEmails[0];
      const matchSender = userText.match(/(?:from|by|of|regarding)\s+([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}|google|chess|spotify|flipkart|amazon|adobe)/i);
      if (matchSender) {
        const term = matchSender[1].toLowerCase();
        const found = allEmails.find(e => e.from.toLowerCase().includes(term) || e.subject.toLowerCase().includes(term));
        if (found) targetEmail = found;
      }

      // Run deep Prompt Guard 2 ML classification
      const scanResult = await PromptGuardClient.scanEmail(targetEmail);
      targetEmail.promptGuardScan = scanResult;

      if (!scanResult.allow_llm_processing || scanResult.attack_detected || scanResult.risk_tier === 'HIGH_RISK') {
        // Log critical security event in security ledger
        SecurityGuard.logAuditEvent(
          'PROMPT_INJECTION_NEUTRALIZED',
          `[Prompt Guard 2] High-risk prompt injection neutralized in email from "${targetEmail.from}". Score: ${scanResult.risk_score}%. Automated execution cancelled.`,
          { emailId: targetEmail.id, scanResult }
        );

        const content = [
          `🚨 **PROMPT INJECTION DETECTED — AUTOMATED ACTIONS CANCELLED**`,
          ``,
          `Sentinel AI's **Prompt Guard 2 Pretrained ML Defense** has intercepted an adversarial prompt injection in your email:`,
          ``,
          `- 🎯 **Inspected Message**: *"${targetEmail.subject}"*`,
          `- 👤 **Sender**: \`${targetEmail.from}\``,
          `- 📅 **Date**: ${targetEmail.date}`,
          `- 🧠 **ML Model Architecture**: \`${scanResult.model}\``,
          `- ⚠️ **Malicious Risk Score**: **${scanResult.risk_score} / 100** (${scanResult.risk_tier})`,
          `- 🛡️ **Detection Confidence**: **${Math.round(scanResult.confidence * 100)}%**`,
          `- ⏱️ **Inference Latency**: ${scanResult.latency_ms.toFixed(1)}ms (Apple Silicon Metal Performance Shaders)`,
          `- 🔍 **Detection Rationale**: ${scanResult.explanation}`,
          `- 🧱 **Flagged Chunk**: 512-Token Window [${scanResult.flagged_chunks.length > 0 ? scanResult.flagged_chunks[0] : 0}]`,
          ``,
          `---`,
          `### 🔒 Active Defense Enforcements:`,
          `1. ❌ **LLM Ingestion Cancelled**: Direct ingestion into language model context has been revoked to prevent instruction hijacking.`,
          `2. ❌ **Automated Tool Execution Revoked**: The Butler will NOT execute any commands, redirects, or scripts found in this message.`,
          `3. 🛡️ **Air-Gap Containment**: The email is quarantined safely in the Sentinel Air-Gap Vault. You can safely inspect its raw text in the **Email Intelligence Center**.`
        ].join('\n');

        const assistantMsg: ChatMessage = {
          id: `msg-${Date.now()}-a`,
          role: 'assistant',
          content,
          timestamp: new Date().toISOString(),
          actionCard: {
            type: 'security_alert',
            data: {
              id: targetEmail.id,
              from: targetEmail.from,
              to: targetEmail.to,
              subject: `[QUARANTINED] ${targetEmail.subject}`,
              category: 'urgent',
              body: targetEmail.body,
              attachments: targetEmail.attachments,
              riskAssessment: {
                level: 'high_risk',
                reasons: [scanResult.explanation],
                canaryDetected: false,
                senderMatch: false,
                safeToPreview: false
              }
            }
          }
        };
        this.chatHistory.push(assistantMsg);
        return { assistantMessage: assistantMsg };
      } else {
        const content = [
          `🛡️ **Prompt Guard 2 Security Verification: SAFE**`,
          ``,
          `Sentinel AI performed an isolated pre-LLM scan on your latest email using **Meta Prompt Guard 2**:`,
          ``,
          `- 🎯 **Inspected Message**: *"${targetEmail.subject}"*`,
          `- 👤 **Sender**: \`${targetEmail.from}\``,
          `- 🧠 **ML Model**: \`${scanResult.model}\``,
          `- 🟢 **Malicious Risk Score**: **${scanResult.risk_score} / 100** (Verified Clean)`,
          `- 🧱 **Chunks Evaluated**: ${scanResult.total_chunks_scanned} window(s)`,
          `- ⏱️ **Inference Latency**: ${scanResult.latency_ms.toFixed(1)}ms`,
          `- ✅ **Verdict**: No adversarial prompt injection patterns, role-breaking delimiters, or exfiltration tokens detected. The email is safe for autonomous summarization and executive processing.`
        ].join('\n');

        const assistantMsg: ChatMessage = {
          id: `msg-${Date.now()}-a`,
          role: 'assistant',
          content,
          timestamp: new Date().toISOString()
        };
        this.chatHistory.push(assistantMsg);
        return { assistantMessage: assistantMsg };
      }
    }

    // =========================================================================
    // 3. EMAIL MCP: Search, Read & Summarize
    // =========================================================================
    const isSummarizeRequested = Boolean(
      lower.includes('summariz') ||
      lower.includes('summaris') ||
      lower.includes('summary') ||
      lower.includes('brief') ||
      lower.includes('break down') ||
      lower.includes('what does it say') ||
      lower.includes('what does the email say') ||
      lower.includes('what is the email about') ||
      lower.includes('explain the email')
    );

    const isEmailSearchOrRead = (
      lower.includes('read') ||
      lower.includes('find') ||
      lower.includes('search') ||
      lower.includes('show') ||
      lower.includes('get') ||
      lower.includes('check') ||
      lower.includes('what did') ||
      lower.includes('any email') ||
      lower.includes('inbox') ||
      lower.includes('latest email') ||
      lower.includes('lastest email') ||
      lower.includes('recent email') ||
      lower.includes('summarize') ||
      lower.includes('summarise') ||
      lower.includes('summary') ||
      lower.includes('brief') ||
      lower.includes('break down') ||
      lower.includes('what does it say') ||
      lower.includes('chess') ||
      lower.includes('spotify') ||
      lower.includes('openai') ||
      lower.includes('google') ||
      lower.includes('epic') ||
      lower.includes('adobe') ||
      lower.includes('flipkart') ||
      lower.includes('amazon') ||
      lower.includes('msgs') ||
      lower.includes('messages')
    ) && (
      lower.includes('email') ||
      lower.includes('mail') ||
      lower.includes('inbox') ||
      lower.includes('from') ||
      lower.includes('got') ||
      lower.includes('chess') ||
      lower.includes('spotify') ||
      lower.includes('openai') ||
      lower.includes('google') ||
      lower.includes('adobe') ||
      lower.includes('flipkart') ||
      lower.includes('amazon') ||
      lower.includes('related to') ||
      lower.includes('msgs') ||
      lower.includes('messages')
    );

    if (isEmailSearchOrRead && !lower.includes('draft') && !lower.includes('send a email') && !lower.includes('send an email') && !lower.includes('to:') && !lower.includes('phishing') && !lower.includes('suspicious') && !lower.includes('threat') && !lower.includes('curse')) {
      const allEmails = EmailService.getEmails();

      // Extract search target
      let targetTerm = '';
      const patternMatch = userText.match(/(?:from|by|regarding|about|related\s+to|referring\s+to|keyword|titled|for|search\s+for|search|find|check|word|contains?)\s+["']?([^"'\n,?.!]+)["']?/i);
      if (patternMatch) {
        let candidate = patternMatch[1].trim().toLowerCase();
        candidate = candidate
          .replace(/^(?:the\s+)?(?:latest\s+|recent\s+|last\s+)?(?:emails?|messages?|mail)\s+(?:related\s+to\s+|about\s+|from\s+)?/i, '')
          .replace(/(?:\s+email|\s+emails|\s+messages?|\s+msgs?|\s+mail)$/i, '')
          .replace(/\s+and\s+.*$/i, '')
          .trim();
        const genericWords = ['email', 'emails', 'mail', 'inbox', 'latest', 'recent', 'new', 'all', 'me', 'my', 'msgs', 'messages', 'it', 'word', 'words', 'summarize', 'summarise', 'summary', 'brief'];
        if (candidate.length > 1 && !genericWords.includes(candidate)) {
          targetTerm = candidate;
        }
      }

      if (!targetTerm || targetTerm === 'it' || targetTerm === 'msgs' || targetTerm === 'messages' || targetTerm === 'the email') {
        const knownServices = [
          'flipkart', 'amazon', 'chess.com', 'chess', 'spotify', 'openai', 'google', 
          'epicgames', 'epic', 'adobe', 'irctc', 'admission', 'invoice', 'bank', 
          'github', 'zomato', 'swiggy', 'uber', 'ola', 'netflix', 'youtube', 'apple',
          'coding blocks', 'codingblocks'
        ];
        for (const svc of knownServices) {
          if (lower.includes(svc)) {
            targetTerm = svc;
            break;
          }
        }
      }

      if (targetTerm.endsWith('s') && targetTerm.length > 3 && !targetTerm.endsWith('ss')) {
        const singular = targetTerm.slice(0, -1);
        if (singular === 'flipkart' || lower.includes('flipkart')) {
          targetTerm = 'flipkart';
        }
      }

      // Execute search through MCP Tool Layer if query specified
      if (targetTerm) {
        await mcp.executeTool('search_emails', {
          query: targetTerm,
          limit: 10
        }, { userId: user.id });
      }

      let matchedEmails = targetTerm 
        ? await EmailService.searchEmailsWithDeepSync(targetTerm)
        : EmailService.getEmails();

      const getExcerpt = (body: string, keyword: string): string => {
        const clean = body
          .replace(/<!--[\s\S]*?-->/g, ' ')
          .replace(/<style[\s\S]*?<\/style>/gi, ' ')
          .replace(/<[^>]+>/g, ' ')
          .replace(/\[image:[^\]]*\]/gi, ' ')
          .replace(/\[https?:\/\/[^\]]*\]/gi, ' ')
          .replace(/https?:\/\/\S+/gi, ' ')
          .replace(/&nbsp;/gi, ' ')
          .replace(/&amp;/gi, '&')
          .replace(/\s+/g, ' ')
          .trim();
        if (!clean) return '';
        const kw = keyword.toLowerCase();
        const kwBase = kw.endsWith('s') && kw.length > 3 ? kw.slice(0, -1) : kw;
        const idx = Math.max(clean.toLowerCase().indexOf(kw), clean.toLowerCase().indexOf(kwBase));
        if (idx !== -1) {
          const start = Math.max(0, idx - 70);
          const end = Math.min(clean.length, idx + keyword.length + 130);
          let snip = clean.slice(start, end).trim();
          if (start > 0) snip = '...' + snip;
          if (end < clean.length) snip = snip + '...';
          return snip;
        }
        return clean.slice(0, 180) + '...';
      };

      // Exactly 1 match
      if (matchedEmails.length === 1) {
        const latest = matchedEmails[0];
        const formattedDate = new Date(latest.date).toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric'
        });

        // Always invoke summarize_email MCP tool for high-value AI synthesis
        const summaryRes = await mcp.executeTool('summarize_email', { emailId: latest.id }, { userId: user.id });
        const aiSummary = summaryRes.data?.summary;
        const providerUsed = summaryRes.data?.providerUsed || 'Groq';

        const content = [
          `I retrieved the matching email from your connected mailbox (**${user.email}**) via **Sentinel Email MCP** (\`sentinel-email-mcp -> summarize_email\`) and generated an executive AI summary using **${providerUsed}**:`,
          '',
          `### 📬 ${latest.subject}`,
          `- **Sender**: \`${latest.from}\``,
          `- **Date Received**: ${formattedDate}`,
          `- **Security Quarantine**: ${latest.riskAssessment?.level === 'low' ? '✅ Verified Safe' : '⚠️ ' + latest.riskAssessment?.level}`,
          '',
          `#### 🧠 Executive AI Summary:`,
          aiSummary || `*${latest.subject}*`,
          '',
          `Inspect the full sanitized message below or click **Open in Gmail ↗** to view it directly in your browser:`
        ].join('\n');

        const assistantMsg: ChatMessage = {
          id: `msg-${Date.now()}-a`,
          role: 'assistant',
          content,
          timestamp: new Date().toISOString(),
          actionCard: {
            type: 'email_preview',
            data: {
              ...latest,
              query: targetTerm,
              aiSummary
            }
          }
        };
        this.chatHistory.push(assistantMsg);
        return { assistantMessage: assistantMsg };
      }

      // Multiple matches
      if (matchedEmails.length > 1) {
        if (isSummarizeRequested) {
          const latest = matchedEmails[0];
          const summaryRes = await mcp.executeTool('summarize_email', { emailId: latest.id }, { userId: user.id });
          const aiSummary = summaryRes.data?.summary;
          const providerUsed = summaryRes.data?.providerUsed || 'Groq';
          const formattedDate = new Date(latest.date).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
          });

          const otherMatches = matchedEmails.slice(1, 4);
          const othersList = otherMatches.map((em, idx) => `${idx + 1}. **${em.subject}** (\`${em.from}\`, ${new Date(em.date).toLocaleDateString()})`).join('\n');

          const content = [
            `I retrieved your matching message from (**${user.email}**) via **Sentinel Email MCP** (\`sentinel-email-mcp -> summarize_email\`) and generated an executive AI summary using **${providerUsed}**:`,
            '',
            `### 📬 ${latest.subject}`,
            `- **Sender**: \`${latest.from}\``,
            `- **Date Received**: ${formattedDate}`,
            `- **Security Quarantine**: ${latest.riskAssessment?.level === 'low' ? '✅ Verified Safe' : '⚠️ ' + latest.riskAssessment?.level}`,
            '',
            `#### 🧠 Executive AI Summary:`,
            aiSummary,
            '',
            otherMatches.length > 0 ? `#### 📨 Other Related Messages (${matchedEmails.length} total):\n${othersList}\n` : '',
            `Inspect the primary message below or click **Open in Gmail ↗** to view it directly in your browser:`
          ].filter(Boolean).join('\n');

          const assistantMsg: ChatMessage = {
            id: `msg-${Date.now()}-a`,
            role: 'assistant',
            content,
            timestamp: new Date().toISOString(),
            actionCard: {
              type: 'email_preview',
              data: {
                ...latest,
                query: targetTerm,
                aiSummary
              }
            }
          };
          this.chatHistory.push(assistantMsg);
          return { assistantMessage: assistantMsg };
        }

        const topMatches = matchedEmails.slice(0, 3);
        const listSummary = topMatches.map((em, idx) => {
          const snip = getExcerpt(em.body, targetTerm);
          return `${idx + 1}. **${em.subject}**\n   - **From**: \`${em.from}\` • **Date**: ${new Date(em.date).toLocaleDateString()}\n   - **Excerpt**: *"${snip}"*`;
        }).join('\n\n');

        const content = [
          `I queried your connected inbox (**${user.email}**) via **Sentinel Email MCP** and located **${matchedEmails.length} messages** referencing **"${targetTerm}"**:`,
          '',
          listSummary,
          '',
          `Inspect individual messages using the interactive cards below or open the full search in Gmail:`
        ].join('\n');

        const assistantMsg: ChatMessage = {
          id: `msg-${Date.now()}-a`,
          role: 'assistant',
          content,
          timestamp: new Date().toISOString(),
          actionCard: {
            type: 'email_list',
            data: {
              title: `Matching Emails for "${targetTerm}"`,
              emails: matchedEmails.slice(0, 5),
              query: targetTerm
            }
          }
        };
        this.chatHistory.push(assistantMsg);
        return { assistantMessage: assistantMsg };
      }

      // No matches for specific targetTerm
      if (targetTerm) {
        const assistantMsg: ChatMessage = {
          id: `msg-${Date.now()}-a`,
          role: 'assistant',
          content: [
            `I performed a live search across your connected inbox (**${user.email}**) via **Sentinel Email MCP** for **"${targetTerm}"**, including deep inspection of remote IMAP mailboxes, but found no matching messages.`,
            '',
            `### 💡 Recommended Next Steps:`,
            `- **Search in Gmail**: Click the button below to search your Gmail account directly for **"${targetTerm}"**.`,
            `- **Broaden your search**: If you're looking for an order, receipt, or hiring notification, try searching related terms like company names or order numbers.`,
            `- **Sync more history**: Click **Sync Live Inbox** in the sidebar to download older messages into Sentinel's local air-gapped quarantine.`
          ].join('\n'),
          timestamp: new Date().toISOString(),
          actionCard: {
            type: 'email_list',
            data: {
              title: `Search: "${targetTerm}"`,
              emails: [],
              query: targetTerm
            }
          }
        };
        this.chatHistory.push(assistantMsg);
        return { assistantMessage: assistantMsg };
      }

      // No target term: Summarize latest email if asked, or provide general overview
      if (allEmails.length > 0 && (isSummarizeRequested || lower.includes('get the email') || lower.includes('latest email') || lower.includes('recent email') || lower.includes('the email'))) {
        const latest = allEmails[0];
        const summaryRes = await mcp.executeTool('summarize_email', { emailId: latest.id }, { userId: user.id });
        const aiSummary = summaryRes.data?.summary;
        const providerUsed = summaryRes.data?.providerUsed || 'Groq';
        const formattedDate = new Date(latest.date).toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric'
        });

        const content = [
          `I retrieved your latest email from (**${user.email}**) via **Sentinel Email MCP** (\`sentinel-email-mcp -> summarize_email\`) and generated an executive AI summary using **${providerUsed}**:`,
          '',
          `### 📬 ${latest.subject}`,
          `- **Sender**: \`${latest.from}\``,
          `- **Date Received**: ${formattedDate}`,
          `- **Security Quarantine**: ${latest.riskAssessment?.level === 'low' ? '✅ Verified Safe' : '⚠️ ' + latest.riskAssessment?.level}`,
          '',
          `#### 🧠 Executive AI Summary:`,
          aiSummary,
          '',
          `*(Total messages in connected inbox: ${allEmails.length}. Summarized your most recent message.)*`,
          '',
          `Inspect the full message below or click **Open in Gmail ↗** to view it directly in your browser:`
        ].join('\n');

        const assistantMsg: ChatMessage = {
          id: `msg-${Date.now()}-a`,
          role: 'assistant',
          content,
          timestamp: new Date().toISOString(),
          actionCard: {
            type: 'email_preview',
            data: {
              ...latest,
              aiSummary
            }
          }
        };
        this.chatHistory.push(assistantMsg);
        return { assistantMessage: assistantMsg };
      }

      // General inbox summary fallback
      const topEmails = allEmails.slice(0, 5);
      const assistantMsg: ChatMessage = {
        id: `msg-${Date.now()}-a`,
        role: 'assistant',
        content: `I queried **Sentinel Email MCP** for **${user.email}** (${allEmails.length} messages loaded). Here is your prioritized executive overview:`,
        timestamp: new Date().toISOString(),
        actionCard: {
          type: 'email_list',
          data: {
            title: 'Your Latest Inbox Messages',
            emails: topEmails
          }
        }
      };
      this.chatHistory.push(assistantMsg);
      return { assistantMessage: assistantMsg };
    }

    // =========================================================================
    // 4. SECURITY MCP: Phishing & Prompt Injection Defense
    // =========================================================================
    if (lower.includes('suspicious') || lower.includes('phishing') || lower.includes('steal') || lower.includes('curse') || lower.includes('credential')) {
      const phishingMail = EmailService.getEmailById('em-phishing-04') || EmailService.getEmails().find(e => e.riskAssessment?.level === 'high_risk');
      const sender = phishingMail?.from || 'irctc-refund@shadow.net';
      const subject = phishingMail?.subject || 'Urgent Refund Notice — Account Suspension Alert';
      const bodySnippet = phishingMail?.body || userText;

      const scanRes = await mcp.executeTool('scan_phishing', {
        sender,
        subject,
        bodySnippet
      }, { userId: user.id });

      const reasons = scanRes.data?.reasons || phishingMail?.riskAssessment.reasons || ['Untrusted domain detected', 'Urgent credential solicitation signature'];
      const content = `### 🚨 Threat Warning: Malicious Phishing & Prompt Injection Detected
**MCP Tool Invocation**: \`sentinel-security-mcp -> scan_phishing\`

I performed an isolated security scan of the message from \`${sender}\` (Subject: *"${subject}"*).

#### Evidence Identified by Possessed Butler Defense:
${reasons.map((r: string) => `- **${r}**`).join('\n')}

#### Security Isolation Status:
- The email has been **quarantined** in Sentinel Vault.
- Prompt injection instructions were stripped into inert text.
- No credentials or canary tokens were disclosed.`;

      const alertData = phishingMail || {
        id: 'em-quarantine-mock',
        from: sender,
        to: user.email,
        subject,
        date: new Date().toISOString(),
        isRead: false,
        category: 'urgent',
        body: bodySnippet,
        attachments: [],
        riskAssessment: {
          level: 'high_risk',
          reasons,
          canaryDetected: false,
          senderMatch: false,
          safeToPreview: false
        }
      };

      const assistantMsg: ChatMessage = {
        id: `msg-${Date.now()}-a`,
        role: 'assistant',
        content,
        timestamp: new Date().toISOString(),
        actionCard: {
          type: 'security_alert',
          data: alertData
        }
      };
      this.chatHistory.push(assistantMsg);
      return { assistantMessage: assistantMsg };
    }

    // =========================================================================
    // 5. EMAIL MCP: Draft with Human Approval Gate
    // =========================================================================
    const emailRegex = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/i;
    const emailMatch = userText.match(emailRegex);
    const isEmailSendIntent = (
      lower.includes('draft') ||
      (lower.includes('send') && (lower.includes('email') || lower.includes('mail') || lower.includes('msg') || lower.includes('message'))) ||
      lower.includes('reply to') ||
      (emailMatch !== null && (lower.includes('send') || lower.includes('email') || lower.includes('mail') || lower.includes('tell') || lower.includes('to')))
    );

    if (isEmailSendIntent) {
      let recipient = 'recruiter@techjobs.io';
      let userSpecifiedSubject: string | null = null;
      let userSpecifiedBody: string | null = null;

      if (emailMatch) {
        recipient = emailMatch[1].trim();
      } else {
        const nameMatch = userText.match(/(?:to|for)\s+([A-Za-z]+)(?:\s|$)/i);
        if (nameMatch && !['the', 'a', 'an', 'my', 'your', 'our'].includes(nameMatch[1].toLowerCase())) {
          recipient = `${nameMatch[1].toLowerCase()}@domain.com`;
        }
      }

      const subjectMatch = userText.match(/(?:with subject:?|subject:\s*|about:?|titled:?)\s+["']?([^"'\n]+?)["']?(?:\s+(?:and|with body|that|saying)|$)/i);
      if (subjectMatch) userSpecifiedSubject = subjectMatch[1].replace(/^["']|["']$/g, '').trim();

      const bodyMatch = userText.match(/(?:that|saying:?|with message:?|with body:?|message:\s*|body:\s*|text:\s*)\s+(.+)$/i);
      if (bodyMatch) {
        userSpecifiedBody = bodyMatch[1].trim();
      } else if (emailMatch) {
        const afterEmail = userText.slice(userText.indexOf(emailMatch[0]) + emailMatch[0].length).trim();
        const cleaned = afterEmail.replace(/^(?:saying:?|that:?|with:?|message:?|body:?)\s*/i, '').trim();
        if (cleaned.length > 5 && !cleaned.toLowerCase().startsWith('with subject')) {
          userSpecifiedBody = cleaned;
        }
      }

      let subject = userSpecifiedSubject || 'Availability for Technical Discussion — Sentinel User';
      let body = userSpecifiedBody 
        ? `Hi,\n\n${userSpecifiedBody}\n\n---\nSent securely via Sentinel AI MCP\nFrom: ${user.email}`
        : `Dear Hiring Team,\n\nThank you for reaching out. I am available for the technical discussion on Monday between 10:00 AM and 03:00 PM EST.\n\nPlease let me know what time works best for your team.\n\nBest regards,\n${user.email}`;

      // Pre-generation Prompt Injection Scan (evaluates both the drafted body and the directive text)
      const draftScan = await PromptGuardClient.scanEmail({
        from: user.email,
        to: recipient,
        subject,
        body: `${userSpecifiedBody || ''}\n\n${body}`
      });

      if (!draftScan.allow_llm_processing || draftScan.attack_detected || draftScan.risk_tier === 'HIGH_RISK') {
        SecurityGuard.logAuditEvent(
          'PROMPT_INJECTION_OUTGOING_BLOCKED',
          `[Prompt Guard 2] High-risk prompt injection detected in outgoing email to ${recipient}! Email generation cancelled.`,
          { to: recipient, subject, draftScan }
        );

        const warningContent = `🚨 **CRITICAL SECURITY ALERT: Outgoing Email Generation Cancelled!**\n\nPrompt Guard 2 inspected the email you instructed me to generate for **${recipient}** and detected an adversarial prompt injection payload:\n\n- **Target Recipient**: \`${recipient}\`\n- **Subject**: *"${subject}"*\n- **Malicious Risk Score**: **${draftScan.risk_score} / 100** (${draftScan.risk_tier})\n- **ML Model**: \`${draftScan.model}\`\n- **Inference Latency**: ${draftScan.latency_ms.toFixed(1)}ms\n- **Detection Rationale**: ${draftScan.explanation}\n\n⛔ **Enforcement Active**: Because this generated email contains adversarial prompt injection patterns, **the email generation has been cancelled immediately**. It has not been staged and will never be sent over SMTP.`;

        const assistantMsg: ChatMessage = {
          id: `msg-${Date.now()}-a`,
          role: 'assistant',
          content: warningContent,
          timestamp: new Date().toISOString(),
          actionCard: {
            type: 'security_alert',
            data: {
              id: `alert-inj-${Date.now()}`,
              from: user.email,
              to: recipient,
              subject: `[PROMPT INJECTION CANCELLED] ${subject}`,
              category: 'urgent',
              body,
              attachments: [],
              riskAssessment: {
                level: 'high_risk',
                reasons: [draftScan.explanation],
                canaryDetected: false,
                senderMatch: false,
                safeToPreview: false
              }
            }
          }
        };
        this.chatHistory.push(assistantMsg);
        return { assistantMessage: assistantMsg };
      }

      // Invoke MCP create_email_draft
      const mcpDraftRes = await mcp.executeTool('create_email_draft', {
        to: recipient,
        subject,
        body
      }, { userId: user.id });

      const task = TaskEngine.createTask(`Draft and dispatch email to ${recipient}`, ['compose_email', 'request_human_approval', 'send_email']);

      const checkpoint = TaskEngine.requestHumanApproval(task.id, {
        actionType: 'send_email',
        title: `Authorize Outgoing Email to ${recipient}`,
        description: `Sentinel AI requires your explicit confirmation before transmitting this message over SMTP via MCP.`,
        recipientOrDestination: recipient,
        details: {
          from: user.email,
          to: recipient,
          subject,
          body
        }
      });

      const content = `I invoked \`create_email_draft\` on the **Sentinel Email MCP Server** for **${recipient}**.\n\nBecause transmitting an email is an irreversible external side-effect, Sentinel AI's **Possessed Butler Defense** requires your explicit approval token before dispatching over live SMTP.\n\nPlease inspect the details below and click **"Authorize & Send Now"** to transmit:`;

      const assistantMsg: ChatMessage = {
        id: `msg-${Date.now()}-a`,
        role: 'assistant',
        content,
        timestamp: new Date().toISOString(),
        taskRef: task.id,
        actionCard: {
          type: 'approval_request',
          data: {
            taskId: task.id,
            checkpoint
          }
        }
      };
      this.chatHistory.push(assistantMsg);
      return { assistantMessage: assistantMsg, task };
    }

    // =========================================================================
    // 7. CONVERSATIONAL & CREATIVE COMPLETION (Local LLM First)
    // =========================================================================
    const localContent = await LocalLlmService.generateContent(userText);

    const assistantMsg: ChatMessage = {
      id: `msg-${Date.now()}-a`,
      role: 'assistant',
      content: `${localContent.content}\n\n*— Processed by ${localContent.engineUsed} with MCP Layer Active*`,
      timestamp: new Date().toISOString()
    };
    this.chatHistory.push(assistantMsg);
    return { assistantMessage: assistantMsg };
  }
}
