import { Inject, Injectable } from '@angular/core';

export interface Menu {
    state: string;
    name: string;
    icon: string;
    role: string;
}

const MENUITEMS = [
    { state: 'dashboard', name: 'Inicio', icon: 'dashboard', role: '' },
    { state: 'category', name: 'Admin. Categoria', icon: 'category', role: 'admin' },
    { state: 'product', name: 'Admin. Producto', icon: 'inventory_2', role: 'admin' },
    { state: 'order', name: 'Admin. Orden', icon: 'list_alt', role: '' },
    { state: 'bill', name: 'Ver Facturas', icon: 'import_contacts', role: '' },
    { state: 'user', name: 'Ver Usuarios', icon: 'people', role: 'admin' }
];

@Injectable()
export class MenuItems {
    getMenuitem(): Menu[] {
        return MENUITEMS;
    }
}