import { request } from '../api'
import { mockMailMessages } from '../mockData/mail'
import type { MailMessage } from '../../types'

export function getMailMessages() {
  return request<MailMessage[]>('/mail/messages', mockMailMessages)
}
