import * as yup from 'yup';

export const schema = yup.object({
    name: yup.string()
        .transform(value => value.replace(/\s\s+/g, ' '))
        .required('Nome é obrigatório')
        .min(3, 'Nome deve ter pelo menos 3 caracteres')
        .max(50, 'Nome deve ter no máximo 50 caracteres')
    ,
    serviceSelected: yup.array()
});
