const settings = Array.from(document.querySelectorAll('.setting'));
let selectedSettingIndex = 0;

const getSelectedSetting = () => settings[selectedSettingIndex % settings.length]

settings.forEach((setting, i) => {
    setting.addEventListener('mouseover', e => {
        getSelectedSetting().style.backgroundColor = 'transparent';
        selectedSettingIndex = i
        e.target.style.backgroundColor = 'black';
    })
})

const shiftSetting = shift => {
    getSelectedSetting().style.backgroundColor = 'transparent';
    selectedSettingIndex += shift;
    getSelectedSetting().style.backgroundColor = 'black';
}

document.addEventListener('keydown', e => {
    if (e.code === 'ArrowDown') {
        shiftSetting(1)
    } else if (e.code === 'ArrowUp') {
        // shiftSetting(1)
    }
})