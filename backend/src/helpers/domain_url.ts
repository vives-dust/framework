import { Application } from '@feathersjs/feathers';


export function resource_url(app: Application, resource: String) {
    return `${app.get('application').domain}/${resource}`
}