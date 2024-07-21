import { Injectable } from '@angular/core';
import { ParseOptions, getParseOptionDefaults } from './options';

/**
 * A helper class for resolving ParseOptions
 */
@Injectable({
  providedIn: 'root'
})
export class OptionsResolver {

  /**
   * Overwrites the default options with a (partial) ParseOptions object and returns the result
   *
   * @param uo - The (partial) ParseOptions object
   */
  resolve(content: any, uo: ParseOptions): ParseOptions {
    const newOptions: ParseOptions = JSON.parse(JSON.stringify(getParseOptionDefaults(content)));
    if (uo) {
      for (const [optionName, optionValue] of Object.entries(uo)) {
        if (optionName === 'sanitize' && typeof optionValue === 'boolean') { newOptions.sanitize = optionValue; }
        else if (optionName === 'convertHTMLEntities' && typeof optionValue === 'boolean') { newOptions.convertHTMLEntities = optionValue; }
        else if (optionName === 'fixParagraphTags' && typeof optionValue === 'boolean') { newOptions.fixParagraphTags = optionValue; }
        else if (optionName === 'updateOnPushOnly' && typeof optionValue === 'boolean') { newOptions.updateOnPushOnly = optionValue; }
        else if (optionName === 'compareInputsByValue' && typeof optionValue === 'boolean') { newOptions.compareInputsByValue = optionValue; }
        else if (optionName === 'compareOutputsByValue' && typeof optionValue === 'boolean') { newOptions.compareOutputsByValue = optionValue; }
        else if (optionName === 'compareByValueDepth' && typeof optionValue === 'number') { newOptions.compareByValueDepth = optionValue; }
        else if (optionName === 'triggerElementEvents' && typeof optionValue === 'boolean') { newOptions.triggerElementEvents = optionValue; }
        else if (optionName === 'triggerGlobalEvents' && typeof optionValue === 'boolean') { newOptions.triggerGlobalEvents = optionValue; }
        else if (optionName === 'ignoreInputAliases' && typeof optionValue === 'boolean') { newOptions.ignoreInputAliases = optionValue; }
        else if (optionName === 'ignoreOutputAliases' && typeof optionValue === 'boolean') { newOptions.ignoreOutputAliases = optionValue; }
        else if (optionName === 'acceptInputsForAnyProperty' && typeof optionValue === 'boolean') { newOptions.acceptInputsForAnyProperty = optionValue; }
        else if (optionName === 'acceptOutputsForAnyObservable' && typeof optionValue === 'boolean') { newOptions.acceptOutputsForAnyObservable = optionValue; }
        else {
          console.error('Invalid option with name "' + optionName + '" and value ', optionValue);
        }
      }
    }
    return newOptions;
  }
}
