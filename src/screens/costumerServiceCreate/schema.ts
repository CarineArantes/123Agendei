import { z } from 'zod';
import { MessageUserKeys } from '@keys';

export const FormSchema = z.object({
    id: z.number().optional(),
    clientName: z.string()
        .nonempty(MessageUserKeys.CLIENT_NAME_REQUIRED),
    clientPhone: z.string()
        .nonempty(MessageUserKeys.CLIENT_PHONE_REQUIRED)
        .refine(value => {
            const phone = value.replace("+55", "").replace(/\D/g, '')
            return phone.length === 11 || phone.length === 10
        }
        , MessageUserKeys.CLIENT_PHONE_INVALID)
        .transform(value => value.replace("+55", "").replace(/\D/g, '')),
    schedulingDate: z.string()
        .nonempty(MessageUserKeys.SCHEDULING_DATE_REQUIRED)
        .transform(value => {
            const [day, month, year] = value.split('/')
            return `${year}-${month}-${day}`
        }),
    schedulingTime: z.string()
        .nonempty(MessageUserKeys.SCHEDULING_TIME_REQUIRED),
    serviceType: z.string()
        .nonempty(MessageUserKeys.SERVICE_TYPE_REQUIRED)
})

export type Form = z.infer<typeof FormSchema>

export const defaultFormValues: Form = {
    clientName: '',
    clientPhone: '',
    schedulingDate: '',
    schedulingTime: '',
    serviceType: ''
}