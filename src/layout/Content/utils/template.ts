const httpTemplate = `(function():PM.Http { 
    return { 
        headers:{  }, 
        body:{ },
        before(ctx:HttpConstructor,send:() => void){ 
             
        }, 
        afert(resp: axios.AxiosResponse){ 
            
        } 
    } 
})\n
`;

export const template = {
    http: httpTemplate
}