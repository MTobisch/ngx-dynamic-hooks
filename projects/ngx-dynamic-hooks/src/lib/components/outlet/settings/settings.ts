import { HookParserEntry } from './parserEntry';
import { OutletOptions } from './options';
import { HookParser } from '../../../interfacesPublic';

export enum DynamicHooksInheritance {
    All,
    Linear,
    None
}

/**
 * The interface for users to define the global options
 */
export interface DynamicHooksGlobalSettings {
    globalParsers?: HookParserEntry[];
    globalOptions?: OutletOptions;
    lazyInheritance?: DynamicHooksInheritance;
}

/**
 * Represents fully resolved settings for a single parsing context
 */
export interface ResolvedSettings {
    parsers: HookParser[];
    options: OutletOptions;
}