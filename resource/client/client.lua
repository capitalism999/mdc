local isOpen = false

local function openMdt()
  isOpen = true
  SetNuiFocus(true, true)
  SendNUIMessage({ action = 'setVisible', data = true })
  SendNUIMessage({ action = 'setConfig', data = { apiBaseUrl = Config.ApiBaseUrl } })
end

local function closeMdt()
  isOpen = false
  SetNuiFocus(false, false)
  SendNUIMessage({ action = 'setVisible', data = false })
end

RegisterNUICallback('close', function(_, cb)
  closeMdt()
  cb({})
end)

RegisterCommand('mdt:open', function()
  if isOpen then
    closeMdt()
  else
    openMdt()
  end
end, false)

RegisterKeyMapping('mdt:open', 'Open MDT', 'keyboard', Config.OpenKey)

AddEventHandler('onResourceStop', function(resourceName)
  if GetCurrentResourceName() == resourceName and isOpen then
    closeMdt()
  end
end)
