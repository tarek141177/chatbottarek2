import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateWidgetCode(chatAgentId: string, config?: any) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"

  return `<!-- AI Chat Widget -->
<script>
  (function() {
    var script = document.createElement('script');
    script.src = '${baseUrl}/widget.js';
    script.setAttribute('data-chat-agent-id', '${chatAgentId}');
    script.setAttribute('data-config', '${JSON.stringify(config || {})}');
    document.head.appendChild(script);
  })();
</script>`
}
