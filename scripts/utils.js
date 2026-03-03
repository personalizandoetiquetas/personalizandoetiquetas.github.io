export const formatCurrency = (value) => {
    const fator = Math.pow(10, 2);
    value = Math.ceil(value * fator) / fator;
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
};