<#macro kw color="" component="a" size="" rest...>
  <#switch color>
    <#case "primary">
      <#assign colorClass="text-link hover:text-link-hover hover:underline">
      <#break>
    <#case "secondary">
      <#assign colorClass="text-ink-muted hover:text-ink-strong">
      <#break>
    <#default>
      <#assign colorClass="text-link hover:text-link-hover hover:underline">
  </#switch>

  <#switch size>
    <#case "small">
      <#assign sizeClass="text-sm">
      <#break>
    <#default>
      <#assign sizeClass="">
  </#switch>

  <${component}
    class="<#compress>${colorClass} ${sizeClass} inline-flex</#compress>"

    <#list rest as attrName, attrValue>
      ${attrName}="${attrValue}"
    </#list>
  >
    <#nested>
  </${component}>
</#macro>
