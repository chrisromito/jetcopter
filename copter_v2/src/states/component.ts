/**
 * @module states/component - Interfaces for component & board state representations
 * Eg. Connected, disconnected, error, etc.
 */

export enum ComponentStatus {
    default,
    connected,
    error
}

export interface ComponentState {
    status: ComponentStatus
}
