import { User } from "auth";
import "reflect-metadata"

export const RouteListSymbol = Symbol("RouteListSymbol")
export class RouteList {
    [RouteListSymbol]? : {
        [key: string]: Route
    }
}

export interface Route {
    name: string
    path: string
    method: 'GET' | 'POST' | 'PATCH' | 'DELETE'
    auth?: boolean
}

export interface RouteRequest {
    user? : User
}

export function Api(target: RouteList, propertyKey: string, descriptor: PropertyDescriptor) : void;
export function Api(args : Partial<Route>) : (target: RouteList, propertyKey: string, descriptor: PropertyDescriptor) => void;
export function Api(target: any, propertyKey?: string, descriptor?: PropertyDescriptor) {
    if(propertyKey) {
        if(!descriptor) {
            throw new Error("Invalid descriptor")
        }
        Api({
            path: '/' + propertyKey,
        })(target, propertyKey, descriptor);
    } else {
        const route : Partial<Route> = target;
        const routePath = route.path;
        if(!routePath) {
            throw new Error("Invalid path")
        }
        return function (target: RouteList, propertyKey: string, descriptor: PropertyDescriptor) {
            const auth = Reflect.getMetadata(authMetadataKey, target, propertyKey);
            const routeList = target[RouteListSymbol] || (target[RouteListSymbol] = {});
            routeList[propertyKey] = {
                name: propertyKey,
                path: routePath,
                method: 'GET',
                auth: !!auth,
                ...route,
            }
        };
    }
}

export function Get(target: RouteList, propertyKey: string, descriptor: PropertyDescriptor) : void;
export function Get(path : string) : (target: RouteList, propertyKey: string, descriptor: PropertyDescriptor) => void;
export function Get(target: any, propertyKey?: string, descriptor?: PropertyDescriptor) {
    if(propertyKey) {
        if(!descriptor) {
            throw new Error("Invalid descriptor")
        }
        Api({
            path: '/' + propertyKey,
            method: 'GET',
        })(target, propertyKey, descriptor);
    } else {
        return Api({
            path: target,
            method: 'GET',
        })
    }
}

export function Post(target: RouteList, propertyKey: string, descriptor: PropertyDescriptor) : void;
export function Post(path : string) : (target: RouteList, propertyKey: string, descriptor: PropertyDescriptor) => void;
export function Post(target: any, propertyKey?: string, descriptor?: PropertyDescriptor) {
    if(propertyKey) {
        if(!descriptor) {
            throw new Error("Invalid descriptor")
        }
        Api({
            path: '/' + propertyKey,
            method: 'POST',
        })(target, propertyKey, descriptor);
    } else {
        return Api({
            path: target,
            method: 'POST',
        })
    }
}

export function Patch(target: RouteList, propertyKey: string, descriptor: PropertyDescriptor) : void;
export function Patch(path : string) : (target: RouteList, propertyKey: string, descriptor: PropertyDescriptor) => void;
export function Patch(target: any, propertyKey?: string, descriptor?: PropertyDescriptor) {
    if(propertyKey) {
        if(!descriptor) {
            throw new Error("Invalid descriptor")
        }
        Api({
            path: '/' + propertyKey,
            method: 'PATCH',
        })(target, propertyKey, descriptor);
    } else {
        return Api({
            path: target,
            method: 'PATCH',
        })
    }
}

export function Delete(target: RouteList, propertyKey: string, descriptor: PropertyDescriptor) : void;
export function Delete(path : string) : (target: RouteList, propertyKey: string, descriptor: PropertyDescriptor) => void;
export function Delete(target: any, propertyKey?: string, descriptor?: PropertyDescriptor) {
    if(propertyKey) {
        if(!descriptor) {
            throw new Error("Invalid descriptor")
        }
        Api({
            path: '/' + propertyKey,
            method: 'DELETE',
        })(target, propertyKey, descriptor);
    } else {
        return Api({
            path: target,
            method: 'DELETE',
        })
    }
}

const authMetadataKey = Symbol("validates");

export function Auth(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    Reflect.defineMetadata(authMetadataKey, true, target, propertyKey);
}

const validatesMetadataKey = Symbol("validates");
const stringFormatMetadataKey = Symbol("stringFormat");
const numberSignMetadataKey = Symbol("numberSign");
const visibilityMetadataKey = Symbol("visibility");

export type numberSignType = '+' | '-'
export type VisibilityType = 'public' | 'private' | 'internal'

export function Validate(target: any, propertyKey : string) : void {
    const type = Reflect.getOwnMetadata("design:type", target, propertyKey);
    if(!type) {
        throw new Error("Missing type information")
    }

    let validates: {
        [key : string] : any
    } = Reflect.getOwnMetadata(validatesMetadataKey, target) || [];
    validates[propertyKey] = type;
    Reflect.defineMetadata( validatesMetadataKey, validates, target);
}

export function StringFormat(format : RegExp | string) {
    const reg = typeof format === 'string' ? new RegExp(format) : format;
    return (target: any, propertyKey : string) => {
        let validates: {
            [key : string] : RegExp
        } = Reflect.getOwnMetadata(stringFormatMetadataKey, target) || [];
        validates[propertyKey] = reg;
        Reflect.defineMetadata( stringFormatMetadataKey, validates, target);
    }
}

export function NumberSign(sign : numberSignType) {
    return (target: any, propertyKey : string) => {
        let validates: {
            [key : string] : numberSignType
        } = Reflect.getOwnMetadata(numberSignMetadataKey, target) || [];
        validates[propertyKey] = sign;
        Reflect.defineMetadata( numberSignMetadataKey, validates, target);
    }
}

export function Visibility(mode : VisibilityType) {
    return (target: any, propertyKey : string) => {
        let validates: {
            [key : string] : VisibilityType
        } = Reflect.getOwnMetadata(visibilityMetadataKey, target) || [];
        validates[propertyKey] = mode;
        Reflect.defineMetadata( visibilityMetadataKey, validates, target);
    }
}

export const Public = Visibility("public");
export const Private = Visibility("private");
export const Internal = Visibility("internal");

const optionalMetadataKey = Symbol("optional");

export function Optional(target: any, propertyKey : string) : void {
    let existingOptionalParameters: string[] = Reflect.getOwnMetadata(optionalMetadataKey, target) || [];
    existingOptionalParameters.push(propertyKey);
    Reflect.defineMetadata( optionalMetadataKey, existingOptionalParameters, target);
}

const itemTypeMetadataKey = Symbol("itemType")
export function ItemType(type : any) {
    return (target: any, propertyKey : string) => {
        let itemTypes: {
            [key : string] : any
        } = Reflect.getOwnMetadata(itemTypeMetadataKey, target) || {};
        itemTypes[propertyKey] = type;
        Reflect.defineMetadata( itemTypeMetadataKey, itemTypes, target);
    }
}

export function toJSON(value : any, type : any, mode : VisibilityType) {
    return convertType(value, type, undefined, undefined, undefined, mode);
}

export function convertType(value : any, type : any, itemType? : any, stringFormat? : RegExp, numberSign? : numberSignType, mode? : VisibilityType) : any {
    if(type === Object) return value;
    else if(type === Number) {
        const v = +value;
        if(isNaN(v)) throw new Error("Invalid Number Format")
        if (numberSign) {
            if(numberSign === '+' && v < 0) {
                throw new Error("Expected Positive Number")
            } else if(numberSign === '-' && v >= 0) {
                throw new Error("Expected Negative Number")
            }
        }
        return v;
    } else if(type === String) {
        if(value) {
            if(typeof value === 'object') {
                throw new Error("Expected String")
            }
            value = `${value}`
            if(stringFormat) {
                if(!stringFormat.test(value)) {
                    throw new Error("Invalid String Format")
                }
            }
            return value
        }
        return null;
    } else if(type === Boolean) {
        if(value === 'true' || value === '1' || value === 1 || value === true) return true;
        else if(value === 'false' || value === '0' || value === 0 || value === false) return false;
        throw new Error("Expected Boolean")
    } else if(type === Date) {
        if(typeof value !== 'number' && !value) return null;
        if(value instanceof Date) return value;
        const date = new Date(value);
        if(isNaN(date.getTime())) {
            throw new Error("Invalid Date Format")
        }
        return date;
    } else if(type === Array) {
        if(!value) return null;
        if(!Array.isArray(value)) {
            throw new Error("Expected Array")
        }
        if(itemType) {
            return value.map(it =>  convertType(it, itemType, undefined, undefined, undefined, mode))
        } else {
            return value;
        }
    } else {
        if(!value) return null;
        if(typeof value !== 'object') {
            throw new Error("Invalid Object")
        }
        const target = new type();
        const validates : {
            [key : string] : any
        } = Reflect.getMetadata(validatesMetadataKey, target) || {};
        const itemTypes : {
            [key : string] : any
        } = Reflect.getMetadata(itemTypeMetadataKey, target) || {};
        const stringFormats : {
            [key : string] : RegExp
        } = Reflect.getMetadata(stringFormatMetadataKey, target) || {};
        const numberSigns : {
            [key : string] : numberSignType
        } = Reflect.getMetadata(numberSignMetadataKey, target) || {};
        const modes : {
            [key : string] : VisibilityType
        } = Reflect.getMetadata(visibilityMetadataKey, target) || {};

        const optionals : string[] = Reflect.getMetadata(optionalMetadataKey, target) || [];

        for(let entry of Object.entries(validates)) {
            if(mode) {
                const curMode = modes[entry[0]];
                if(curMode) {
                    if(mode === 'private' && curMode === 'internal') continue;
                    else if(mode === 'public' && (curMode === 'internal' || curMode === 'private')) continue;
                }
            }

            try {
                const field = convertType(value[entry[0]], entry[1], itemTypes[entry[0]], stringFormats[entry[0]], numberSigns[entry[0]], mode);
                if(typeof field !== 'number' && !field) {
                    if(optionals.indexOf(entry[0]) === -1) {
                        throw new Error("Missing required field")
                    }
                }
                target[entry[0]] = field;
            } catch(e) {
                throw new Error(entry[0] + ": " + e.message);
            }
        }
        return target;
    }
}

export function getUniqueString() : string {
    return (
      new Date().getTime().toString(16) +
      Math.floor(1000 * Math.random()).toString(16)
    );
}
