import { assoc, head, isNil, prop } from 'ramda'
import * as config from './config'
import {
    COLUMN,
    EQ,
    QUERY,
    IN,
    SET,
    TABLE,
    VALUES,
    SQL
} from './config'

export * from './config'


export const cast = typeMap => {
    const typePairs = Object.entries(typeMap)
    return obj =>
        typePairs.reduce(
            (accum, [k, v]) =>
                assoc(
                    k,
                    v(prop(k, obj)),
                    accum
                ),
            { ...obj }
        )
}


const identity = x => x

const unWrap = Ctor => value =>
    !(value instanceof Ctor)
        ? value
        : value.value()


export class Meta {
    constructor(value) {
        this._value = value
    }

    static get [Symbol.species]() {
        return this
    }

    static of(...values) {
        const Ctor = this[Symbol.species]
        return new Ctor(...values)
    }

    value() {
        return this._value
    }

    map(actor=identity) {
        const Ctor = this.constructor[Symbol.species]
        return new Ctor(
            actor(this.value())
        )
    }

    flatMap(actor=identity) {
        const Ctor = this.constructor[Symbol.species]
        const lift = unWrap(Ctor)
        return actor(
            lift(this.value())
        )
    }
}


export class Query {
    constructor(tableName) {
        this.tableName = tableName
    }

    errorHandler(err) {
        try {
            if (err.message && err.constructor) {
                const extended = new err.constructor(`${this.tableName} -> ${err.message}`)
                extended.stack = err.stack
                return Promise.reject(extended)
            }
        } catch (e) {
        }
        return Promise.reject(err)
    }


    selectWhere(where, columns=null) {
        return QUERY`
            SELECT ${COLUMN(columns || '*')}
                FROM ${TABLE(this.tableName)}
                WHERE ${EQ(where)}
        `
    }

    selectWhereIn(columnName, list, columns=null) {
        return QUERY`
            SELECT ${COLUMN(columns || '*')}
                FROM ${TABLE(this.tableName)}
                WHERE ${IN(columnName, list)}
        `
    }


    selectOneWhere(where, columns) {
        return (QUERY`
            SELECT ${COLUMN(columns || '*')}
                FROM ${TABLE(this.tableName)}
                WHERE ${EQ(where)}
                LIMIT(1)
        `)
        .then(list => list.length ? head(list) : null)
    }

    insert(newData) {
        return (QUERY`
            INSERT INTO ${TABLE(this.tableName)}
                ${VALUES(newData)}
                RETURNING *
        `)
        .then(head)
        .catch(e =>
            this.errorHandler(e)
        )
    }

    updateWhere(where, newData) {
        return (QUERY`
            UPDATE ${TABLE(this.tableName)}
                ${SET(newData)}
                WHERE ${EQ(where)}
                RETURNING *
        `)
    }

    updateIn(columnName, list, newData) {
        return QUERY`
            UPDATE ${TABLE(this.tableName)}
                ${SET(newData)}
                WHERE ${IN(columnName, list)}
                RETURNING *
        `
    }

    deleteWhere(where) {
        return QUERY`
            DELETE FROM ${TABLE(this.tableName)}
                WHERE ${EQ(where)}
        `
    }

    getById(id) {
        return isNil(id)
            ? Promise.resolve(null)
            : (QUERY`
                SELECT * 
                    FROM ${TABLE(this.tableName)}
                    WHERE id = ${id}
                    LIMIT(1)
            `)
            .then(head)
    }

    getOrCreate(where, data) {
        return (QUERY`
            SELECT * 
                FROM ${TABLE(this.tableName)}
                WHERE ${EQ(where)}
                LIMIT(1)
        `)
        .then(rows =>
            rows.length
                ? head(rows)
                : this.insert(data)
        )
    }
}


export const defaultOptions = {
    required: false,
    defaultValue: undefined,
    getDefaultValue: field => field.empty ? field.empty() : field.type()
}

export class Field extends Meta {
    type = Object
    columnName = null
    options = defaultOptions

    constructor({ type, columnName, options = defaultOptions }) {
        super({ type, columnName, options })
        this.type = type
        this.columnName = columnName
        this.options = options
    }
}

