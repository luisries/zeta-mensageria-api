require('dotenv').config({silent: true, });

export interface Configuracao{
    prefixo: string;
    apiMiddleware: string;
    authMiddleware: string;
}

export const CONFIG_PADRAO: Configuracao = {
    prefixo: process.env.CLARION_PREFIXO || 'zw15',
    apiMiddleware: process.env.CLARION_APIMIDDLEWARE || 'http://localhost:3010/api/v1/entities',
    authMiddleware: process.env.CLARION_AUTHMIDDLEWARE || 'Basic emV0YTphMjk5bWVjeg=='
    //apiMiddleware: process.env.CLARION_APIMIDDLEWARE || 'http://zeta06.primusweb.com.br:5005/api/v1/entities',
    //authMiddleware: process.env.CLARION_AUTHMIDDLEWARE || 'Basic emV0YTphMjQ5bWVjeg=='
};

