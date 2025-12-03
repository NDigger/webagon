import { getConfig, writeConfig } from "./storage";
import { sounds } from "./script"; 
import { defaultConfig } from "./storage";

const config = getConfig()

const round = v => Math.round(v * 100) / 100;

const settings = document.getElementById('settings-container');
const getKeydownEventsEnabled = () => document.getElementById('settings').getAttribute('data-events-enabled') === 'true';

const settingsList = [];
let selectedSettingIndex = 0;

const getSelectedSetting = () => settingsList[selectedSettingIndex]

const compareAndUpdateSetting = (setting, settingProp) => {
    config[settingProp] === defaultConfig[settingProp]
    ? setting.classList.remove('edited')
    : setting.classList.add('edited');
}

settings.addEventListener('keydown', e => {
    if (!getKeydownEventsEnabled()) return
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) e.preventDefault();
});

const shiftSetting = shift => {
    getSelectedSetting().classList.remove('selected');
    const result = (shift + selectedSettingIndex + settingsList.length) % settingsList.length;
    selectedSettingIndex = isNaN(result) ? 0 : result;
    const newSetting = getSelectedSetting();
    newSetting.classList.add('selected');
    newSetting.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
}

document.addEventListener('keydown', e => {
    if (!getKeydownEventsEnabled()) return
    if (e.code === 'ArrowDown') shiftSetting(1)
    else if (e.code === 'ArrowUp') shiftSetting(-1)
    if (
        e.code === 'ArrowDown' || 
        e.code === 'ArrowUp' || 
        e.code === 'Enter' || 
        e.code === 'ArrowLeft' ||
        e.code === 'ArrowRight'
    ) sounds.levelSelect.play()
})

class Setting {
    element;

    #configProp;
    #props;
    #value;

    constructor(configProp, props) {
        this.#configProp = configProp;
        this.#props = props;
        this.#value = config[configProp];
    }

    getConfigProperty() { return this.#configProp; }
    getDefaultValue() { return this.#value; }
    getProps() { return this.#props; }

    insertHTML(html) {
        settings.insertAdjacentHTML('beforeend', html);
        this.element = settings.lastElementChild;
        settingsList.push(this.element);
        compareAndUpdateSetting(this.element, this.#configProp)
    }
}

class BooleanSetting extends Setting {
    getLightContent(v) { return v === true ? 'var(--main-color)' : 'transparent'}
    onChange = () => {};
    constructor(configProp, props) {
        super(configProp, props);
        const name = props.name;

        this.insertHTML(`
        <div id="${configProp}" class="setting boolean">
            <div class="light" style="--after-bg-color: ${this.getLightContent(this.getDefaultValue())}"></div>
            <div class="inner">
                <p>${name}</p> 
            </div>
        </div>`)

        const revertValue = () => {
            sounds.levelSelect.play();
            this.setValue(!config[configProp]);
        }

        this.element.addEventListener('click', () => revertValue())

        document.addEventListener('keydown', e => {
            if (getSelectedSetting() !== this.element || !getKeydownEventsEnabled()) return
            if (e.code === 'ArrowLeft' || e.code === 'ArrowRight' || e.code === 'Enter') {
                revertValue();
            }
        })
    }

    setValue(v) {
        const configProp = this.getConfigProperty();
        config[configProp] = v;
        const newProp = config[configProp];
        this.element.querySelector('.light').style.setProperty('--after-bg-color', this.getLightContent(newProp))

        compareAndUpdateSetting(this.element, configProp)
        writeConfig(config)
        this.onChange();
    }
}

class NumberSetting extends Setting {
    constructor(configProp, props) {
        super(configProp, props)

        const name = props.name;
        const min = props.min;
        const max = props.max;
        const shift = props.shift;

        this.insertHTML(`
            <div class="setting number" id=${configProp}>
                <p>${name}</p>
                <p class="value">${this.getDefaultValue()}</p>
                <div class="range-container">
                    <input type="range" min="${min}" max="${max}" step="${shift}" value="${this.getDefaultValue()}">
                </div>
            </div>
        `)

        const rangeInput = this.element.querySelector('input[type="range"]');
        const valueElement = this.element.querySelector('.value')
        rangeInput.addEventListener('input', e => {
            const v = e.target.value;
            valueElement.textContent = v;
            config[configProp] = Number(v);
            writeConfig(config)
            compareAndUpdateSetting(this.element, configProp)
        })

        document.addEventListener('keydown', e => {
            if (getSelectedSetting() !== this.element || !getKeydownEventsEnabled()) return
            if (e.code === 'ArrowLeft' || e.code === 'ArrowRight') {
                let result
                if (e.code === 'ArrowLeft') result = round(config[configProp] - shift);
                else if (e.code === 'ArrowRight') result = round(config[configProp] + shift);
                result = Math.max(min, Math.min(max, result))
                config[configProp] = result

                valueElement.textContent = config[configProp].toString();
                rangeInput.value = result;
                writeConfig(config)
                compareAndUpdateSetting(this.element, configProp)
            }
        })
    }
}

const pushCategory = name => settings.insertAdjacentHTML('beforeend', `
    <div class="category">
        <span></span>
        <h2>${name}</h2>
        <span></span>
    </div>`
)

pushCategory('Gameplay');
new BooleanSetting('invincibleModeEnabled', {name: 'Invincible mode'});
new BooleanSetting('swapOnHold', {name: 'Swap on Hold'});

pushCategory('Visuals');
new NumberSetting('playerTiltMult', {
    name: 'Player tilt mult:',
    min: 0,
    max: 1.5,
    shift: 0.1
});
new BooleanSetting('swapHighlightEnabled', {name: 'Swap Highlight'});
new BooleanSetting('displayFpsEnabled', {name: 'Display FPS'});
// new BooleanSetting('displayUiEnabled', {name: 'Display UI'});
new BooleanSetting('flashOnDeathEnabled', {name: 'Flash Effect on death'});
new BooleanSetting('swapParticlesEnabled', {name: 'Swap Particles'});
new BooleanSetting('funModeEnabled', {name: 'How funny...'});

pushCategory('Audio');
const getAudioProps = name => { return {
    name: name,
    min: 0,
    max: 1,
    shift: 0.1
}}
new NumberSetting('musicVolume', getAudioProps('Music Volume'));
new NumberSetting('soundsVolume', getAudioProps('Sounds volume'));
new BooleanSetting('deathSoundEnabled', {name: 'Death sound'});

const elem = document.documentElement;
const openFullscreen = () => {
  if (elem.requestFullscreen) elem.requestFullscreen();
  else if (elem.webkitRequestFullscreen) elem.webkitRequestFullscreen();
  else if (elem.msRequestFullscreen) elem.msRequestFullscreen();
}
const closeFullscreen = () => {
  if (document.exitFullscreen) document.exitFullscreen();
  else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
  else if (document.msExitFullscreen) document.msExitFullscreen();
}

shiftSetting(0); // highlight selected setting