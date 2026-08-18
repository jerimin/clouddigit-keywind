<#macro kw>
  <div class="flex flex-col items-center gap-3">
    <svg
      class="h-12 w-12"
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Cloud Digit"
    >
      <defs>
        <linearGradient id="cd-mark" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#f6821f" />
          <stop offset="100%" stop-color="#fbad41" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="14" fill="url(#cd-mark)" />
      <path
        d="M44.5 40.5a8.5 8.5 0 0 0-1.4-16.9 12.5 12.5 0 0 0-23.7 3.2 9.2 9.2 0 0 0 1.1 18.4h23.2a4.5 4.5 0 0 0 .8-.1z"
        fill="#ffffff"
      />
    </svg>
    <div class="font-bold text-center text-2xl">
      <#nested>
    </div>
  </div>
</#macro>
