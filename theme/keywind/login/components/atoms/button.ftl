<#macro kw color="" component="button" size="" rest...>
  <#switch color>
    <#case "primary">
      <#assign colorClass="cd-btn-primary">
      <#break>
    <#case "secondary">
      <#assign colorClass="cd-btn-secondary">
      <#break>
    <#default>
      <#assign colorClass="cd-btn-primary">
  </#switch>

  <#switch size>
    <#case "medium">
      <#assign sizeClass="px-4 py-2 text-sm">
      <#break>
    <#case "small">
      <#assign sizeClass="px-2 py-1 text-xs">
      <#break>
    <#default>
      <#assign sizeClass="px-4 py-2 text-sm">
  </#switch>

  <${component}
    class="${colorClass} ${sizeClass} flex justify-center relative rounded-control w-full font-semibold focus:outline-none"

    <#list rest as attrName, attrValue>
      ${attrName}="${attrValue}"
    </#list>
  >
    <#nested>
  </${component}>
</#macro>
