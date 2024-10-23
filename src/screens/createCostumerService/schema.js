import * as yup from 'yup';

export const schema = yup.object({
    clientName: yup.string()
        .transform(value => value.replace(/\s\s+/g, ' '))
        .required('Nome do cliente é obrigatório')
        .min(3, 'Nome deve ter pelo menos 3 caracteres')
        .max(50, 'Nome deve ter no máximo 50 caracteres')
    ,
    clientPhone: yup.string()
        .transform(value => value.replace(/\s\s+/g, ' '))
        .required('Telefone do cliente é obrigatório')
        .test('is-valid-phone', 'Número de telefone inválido', value => {
            if (!value) return false;
            const phone = value.replace(/\D/g, '');
            return phone.length === 11 || phone.length === 10;
        })
    ,
    schedulingDate: yup.string()
        .required('Data do atendimento é obrigatória')
    ,
    schedulingTime: yup.string()
        .required('Hora do atendimento é obrigatória')
    ,
    employeeId: yup.string()
        .required('Funcionário é obrigatório')
    ,
    serviceId: yup.string()
        .required('Serviço é obrigatório')
});
