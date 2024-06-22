import { Inject, Injectable, Injector, Optional } from '@angular/core';
import { OutletOptions, outletOptionDefaults } from './options';
import { DynamicHooksSettings, DynamicHooksInheritance, ResolvedSettings } from './settings';
import { ParserEntryResolver } from './parserEntryResolver';
import { OptionsResolver } from './optionsResolver';
import { HookParserEntry } from './parserEntry';
import { HookParser } from '../../interfacesPublic';

/**
 * A helper class for resolving settings object and merge potentially multiple ones from different child modules/injection contexts
 */
@Injectable({
  providedIn: 'root'
})
export class SettingsResolver {

  constructor(
    private injector: Injector,
    private parserEntryResolver: ParserEntryResolver,
    private optionsResolver: OptionsResolver
  ) {
  }

  public resolve(
    allSettings: DynamicHooksSettings[],
    ancestorSettings: DynamicHooksSettings[],
    moduleSettings: DynamicHooksSettings, 
    localParsers: HookParserEntry[]|null = null, 
    localOptions: OutletOptions|null = null,
    globalParsersBlacklist: string[]|null = null,
    globalParsersWhitelist: string[]|null = null,
    injector: Injector|null = null
  ): ResolvedSettings {
    let resolvedSettings: DynamicHooksSettings = {};

    if (!moduleSettings.hasOwnProperty('inheritance') || moduleSettings.inheritance === DynamicHooksInheritance.All) {
      // Make sure the options of ancestorSettings (which include current moduleSettings as last entry) are last to be merged so that they always overwrite all others
      // This is in case other settings were added to the back of allSettings after registering this module
      resolvedSettings = this.mergeSettings([...allSettings, ...ancestorSettings]);

    } else if (moduleSettings.inheritance === DynamicHooksInheritance.Linear) {
      resolvedSettings = this.mergeSettings(ancestorSettings);

    } else if (moduleSettings.inheritance === DynamicHooksInheritance.None) {
      resolvedSettings = moduleSettings;
      
    } else {
      throw new Error(`Incorrect DynamicHooks inheritance configuration. Used value "${moduleSettings.inheritance}" which is not part of DynamicHooksInheritance enum. Only "All", "Linear" and "None" enum options are allowed`);
    }

    const resolvedParsers = this.resolveParsers(resolvedSettings.parsers || null, localParsers, injector || this.injector, globalParsersBlacklist, globalParsersWhitelist);
    const resolvedOptions = this.resolveOptions(resolvedSettings.options || null, localOptions);

    return {
      parsers: resolvedParsers,
      options: resolvedOptions
    };
  }

  /**
   * Merges multiple settings objects, overwriting previous ones with later ones in the provided array
   *
   * @param settingsArray - The settings objects to merge
   */
  private mergeSettings(settingsArray: DynamicHooksSettings[]): DynamicHooksSettings {
    const mergedSettings: DynamicHooksSettings = {};

    for (const settings of settingsArray) {
      // Unique parsers are simply all collected, not overwritten
      if (settings.parsers !== undefined) {
        if (mergedSettings.parsers === undefined) {
          mergedSettings.parsers = [];
        }
        for (const parserEntry of settings.parsers) {
          if (!mergedSettings.parsers.includes(parserEntry)) {
            mergedSettings.parsers.push(parserEntry);
          }
        }
      }
      // Options are individually overwritten
      if (settings.options !== undefined) {
        if (mergedSettings.options === undefined) {
          mergedSettings.options = {};
        }

        mergedSettings.options = Object.assign(mergedSettings.options, settings.options);
      }
    }

    return mergedSettings;
  }

  /**
   * Loads the relevant outlet options
   */
  private resolveOptions(globalOptions: OutletOptions|null, localOptions: OutletOptions|null): OutletOptions {
    let resolvedOptions: OutletOptions;

    // If local
    if (localOptions) {
      resolvedOptions = this.optionsResolver.resolve(localOptions);
    // If global
    } else if (globalOptions) {
      resolvedOptions = this.optionsResolver.resolve(globalOptions);
    // If none given
    } else {
      resolvedOptions = outletOptionDefaults;
    }

    return resolvedOptions;
  }

  /**
   * Loads the relevant parser configuration
   */
  private resolveParsers(globalParsers: HookParserEntry[]|null, localParsers: HookParserEntry[]|null, injector: Injector, globalParsersBlacklist: string[]|null, globalParsersWhitelist: string[]|null): Array<HookParser> {
    let resolvedParsers: Array<HookParser>;

    // If local
    if (localParsers) {
      resolvedParsers = this.parserEntryResolver.resolve(localParsers, injector);
    // If global
    } else if (globalParsers) {
      resolvedParsers = this.parserEntryResolver.resolve(globalParsers, injector, globalParsersBlacklist, globalParsersWhitelist);
    // If none given
    } else {
      resolvedParsers = [];
    }

    return resolvedParsers;
  }
}