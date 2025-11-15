import { getConfig, writeConfig } from "./storage";
import { sounds } from "./script"; 
import { defaultConfig } from "./storage";

export const setSettingsVisible = v => {
    keydownEventsEnabled = v;
    document.getElementById('settings').style.display = v ? 'flex' : 'none'
}
let keydownEventsEnabled = false;

const config = getConfig()

const round = v => Math.round(v * 100) / 100;

const settings = Array.from(document.querySelectorAll('.setting'));
let selectedSettingIndex = 0;

const getSelectedSetting = () => settings[selectedSettingIndex]

const compareAndUpdateSetting = (setting, settingProp) => {
    config[settingProp] === defaultConfig[settingProp]
    ? setting.classList.remove('edited')
    : setting.classList.add('edited');
    console.log(config[settingProp], defaultConfig[settingProp])
}

settings.forEach((setting, i) => {
    setting.addEventListener('mouseover', e => {
        getSelectedSetting().classList.remove('selected');
        selectedSettingIndex = i
        e.currentTarget.classList.add('selected');
    })

    const settingType = setting.getAttribute('data-type');
    const settingProp = setting.getAttribute('data-prop');
    const settingValue = setting.querySelector('.value');

    if (settingType === 'boolean') {
        document.addEventListener('keydown', e => {
            if (selectedSettingIndex !== i || !keydownEventsEnabled) return
            if (e.code === 'ArrowLeft' || e.code === 'ArrowRight' || e.code === 'Enter') {
                config[settingProp] = !config[settingProp];
                settingValue.textContent = config[settingProp] ? 'Enabled' : 'Disabled'

                compareAndUpdateSetting(setting, settingProp)
                writeConfig(config)
            }
        })
    }
    else if (settingType === 'number') {
        const settingMinValue = +setting.getAttribute('data-min');
        const settingMaxValue = +setting.getAttribute('data-max');
        const settingShift = +setting.getAttribute('data-shift');
        document.addEventListener('keydown', e => {
            if (selectedSettingIndex !== i || !keydownEventsEnabled) return
            if (e.code === 'ArrowLeft' || e.code === 'ArrowRight') {
                let result
                if (e.code === 'ArrowLeft') result = round(config[settingProp] - settingShift);
                else if (e.code === 'ArrowRight') result = round(config[settingProp] + settingShift);
                result = Math.max(settingMinValue, Math.min(settingMaxValue, result))
                config[settingProp] = result

                settingValue.textContent = config[settingProp].toString();
                writeConfig(config)
                compareAndUpdateSetting(setting, settingProp)
            }
        })
    }

    // When page first time loaded
    if (settingType === 'number') {
        setting.querySelector('.value').textContent = config[settingProp]
    } else if (settingType === 'boolean') {
        setting.querySelector('.value').textContent = config[settingProp] ? 'Enabled' : 'Disabled'
    }
    compareAndUpdateSetting(setting, settingProp)
})

const shiftSetting = shift => {
    getSelectedSetting().classList.remove('selected');
    selectedSettingIndex = (shift + selectedSettingIndex + settings.length) % settings.length;
    getSelectedSetting().classList.add('selected');
}

document.addEventListener('keydown', e => {
    if (!keydownEventsEnabled) return
    if (e.code === 'ArrowDown') shiftSetting(1)
    else if (e.code === 'ArrowUp') shiftSetting(-1)
    else if (e.code === 'Escape') {
        keydownEventsEnabled = false;
        document.getElementById('settings').style.display = 'none'
    }
    if (
        e.code === 'ArrowDown' || 
        e.code === 'ArrowUp' || 
        e.code === 'Escape' || 
        e.code === 'ArrowLeft' ||
        e.code === 'ArrowRight'
    ) sounds.levelSelect.play()
})

shiftSetting(0);

const applyToSettingValue = (settingId, v) => document.getElementById(settingId).querySelector('.value').textContent = v;