import { z } from 'zod';
import { MessageUserKeys } from '@keys';

export const FormSchema = z.object({
    clientName: z.string()
        .nonempty(MessageUserKeys.CLIENT_NAME_REQUIRED),
    clientPhone: z.string()
        .nonempty(MessageUserKeys.CLIENT_PHONE_REQUIRED)
        .refine(value =>
            /^\+55 \(\d{2}\) \d{5}-\d{4}$/.test(value) ||
            /^\+55 \(\d{2}\) \d{5}-\d{3}$/.test(value)
            , MessageUserKeys.CLIENT_PHONE_INVALID),
    schedulingDate: z.string()
        .nonempty(MessageUserKeys.SCHEDULING_DATE_REQUIRED)
        .transform(value => {
            const [day, month, year] = value.split('/')
            return `${year}-${month}-${day}`
        }),
    schedulingTime: z.string()
        .nonempty(MessageUserKeys.SCHEDULING_TIME_REQUIRED),
    attendant: z.string(),
    serviceType: z.string()
        .nonempty(MessageUserKeys.SERVICE_TYPE_REQUIRED)
})

export type Form = z.infer<typeof FormSchema>

export const defaultFormValues: Form = {
    clientName: '',
    clientPhone: '',
    schedulingDate: '',
    schedulingTime: '',
    attendant: '',
    serviceType: ''
}