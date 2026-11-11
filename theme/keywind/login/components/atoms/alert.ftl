<#macro kw color="">
  <#switch color>
    <#case "error">
      <#assign colorClass="bg-danger-bg border-danger-line text-danger-text">
      <#break>
    <#case "info">
      <#assign colorClass="bg-info-bg border-info-line text-info-text">
      <#break>
    <#case "success">
      <#assign colorClass="bg-success-bg border-success-line text-success-text">
      <#break>
    <#case "warning">
      <#assign colorClass="bg-warning-bg border-warning-line text-warning-text">
      <#break>
    <#default>
      <#assign colorClass="bg-info-bg border-info-line text-info-text">
  </#switch>

  <div class="${colorClass} border p-4 rounded-control text-sm" role="alert">
    <#nested>
  </div>
</#macro>
