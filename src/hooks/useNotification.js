import { useToast } from 'primevue/usetoast'

/**@typedef {{summary: string, detail: string, life: number, severity: 'success' | 'info' | 'warn' | 'error' | 'secondary' | 'contrast'}} ToastConfig*/
/**@typedef {{summary: string, detail: string, life: number }} NotificationConfig*/

function useNotification() {
  const toast = useToast()

  /**
   * @param {ToastConfig} config
   */
  function notify({
    summary,
    detail,
    life = 2_000,
    severity = 'info'
  } = {}) {
    toast.add({
      summary,
      detail,
      severity,
      life
    })
  }

  /**
   * @param {NotificationConfig} config 
   */
  function success(config) {
    notify({...config, severity: 'success'})
  }

  /**
   * @param {NotificationConfig} config 
   */
  function error(config) {
    notify({...config, severity: 'error'})
  }

  /**
   * @param {NotificationConfig} config 
   */
  function warn(config) {
    notify({...config, severity: 'warn'})
  }

  return {
    success,
    error,
    warn
  }
}

export default useNotification