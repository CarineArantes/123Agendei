import * as yup from 'yup';

export const schema = yup.object({
    name: yup.string()
        .transform(value => value.replace(/\s\s+/g, ' '))
        .required('Nome é obrigatório')
        .min(5, 'Nome deve ter pelo menos 5 caracteres')
        .max(50, 'Nome deve ter no máximo 50 caracteres')
    ,
    description: yup.string()
        .transform(value => value.replace(/\s\s+/g, ' '))
        .required('Descrição é obrigatória')
        .min(5, 'Descrição deve ter pelo menos 5 caracteres')
        .max(100, 'Descrição deve ter no máximo 100 caracteres')
    ,
    favorite: yup.boolean(),
});
