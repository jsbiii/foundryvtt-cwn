// eslint-disable-next-line no-unused-vars
import { CwnActor } from '../actor/entity.js';

export class CwnEntityTweaks extends FormApplication {
  static get defaultOptions() {
    const options = super.defaultOptions;
    options.id = 'sheet-tweaks';
    options.template =
      'systems/cwn/templates/actors/dialogs/tweaks-dialog.html';
    options.width = 580;
    return options;
  }

  /* -------------------------------------------- */

  /**
   * Add the Entity name into the window title
   * @type {String}
   */
  get title() {
    return `${this.object.name}: ${game.i18n.localize('CWN.dialog.tweaks')}`;
  }

  /* -------------------------------------------- */

  /**
   * Construct and return the data object used to render the HTML template for this form application.
   * @return {Object}
   */
  getData() {
    const data = foundry.utils.deepClone(this.object);
    if (data.type === 'character') {
      data.isCharacter = true;
    }
    data.user = game.user;
    data.config = CONFIG.CWN;
    return data;
  }

  /* -------------------------------------------- */

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);
  }

  /**
   * This method is called upon form submission after form data is validated
   * @param event {Event}       The initial triggering submission event
   * @param formData {Object}   The object of validated form data with which to update the object
   * @private
   */
  async _updateObject(event, formData) {
    event.preventDefault();
    // Update the actor
    await this.object.update(formData);
    // Re-draw the updated sheet
    this.object.sheet.render(true);
  }
}
