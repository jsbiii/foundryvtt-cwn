export class CwnPartyCurrency extends FormApplication {

    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            classes: ["cwn", "dialog", "party-xp"],
            template: "systems/cwn/templates/apps/party-coin.html",
            width: 280,
            height: 400,
            resizable: false,
        });
    }

    /* -------------------------------------------- */
    /**
     * Add the Entity name into the window title
     * @type {String}
     */
    get title() {
        return game.i18n.localize("CWN.dialog.currency.deal");
    }

    /* -------------------------------------------- */
    /**
     * Construct and return the data object used to render the HTML template for this form application.
     * @return {Object}
     */
    getData() {
        const actors = game.actors.filter(e => e.type === "character" && e.flags.cwn && e.flags.cwn.party === true);
        let data = {
            actors: actors,
            data: this.object,
            config: CONFIG.CWN,
            user: game.user,
            settings: settings
        };
        return data;
    }

    _onDrop(event) {
        event.preventDefault();
        // WIP Drop Item Quantity
        let data;
        try {
            data = JSON.parse(event.dataTransfer.getData("text/plain"));
            if (data.type !== "Item") return;
        } catch (err) {
            return false;
        }
    }
    /* -------------------------------------------- */

    _calculateShare(ev) {
        const actors = game.actors.filter(e => e.type === "character" && e.flags.cwn && e.flags.cwn.party === true);
        const toDeal = $(ev.currentTarget.parentElement).find('input[name="total"]').val();
        const html = $(this.form);
        let shares = 0;
        actors.forEach((a) => {
            shares += a.system.currency.share;
        });
        const value = parseFloat(toDeal) / shares;
        if (value) {
            actors.forEach(a => {
                html.find(`div[data-actor-id='${a.id}'] input`).val(Math.floor(a.system.currency.share * value));
            })
        }
    }

    _dealCurrency(ev) {
        const html = $(this.form);
        const rows = html.find('.actor');
        rows.each((_, row) => {
            const qRow = $(row);
            const value = qRow.find('input').val();
            const id = qRow.data('actorId');
            const actor = game.actors.find(e => e.id === id);
            if (value) {
                actor.getBank(Math.floor(parseInt(value)));
            }
        })
    }

    /** @override */
    activateListeners(html) {
        super.activateListeners(html);
        html
            .find('button[data-action="calculate-share"')
            .click(this._calculateShare.bind(this));
        html
            .find('button[data-action="deal-currency"')
            .click(this._dealCurrency.bind(this));
    }
}
