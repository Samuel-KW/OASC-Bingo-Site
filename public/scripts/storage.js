// Alert if local storage is disabled
if (typeof localStorage === 'undefined')
    alert('Local storage is disabled, please enable it to use this page.');

// Store a map containing entered bingo codes
const savedBingoCodes = new Map();

/**
 * Add a bingo code to the map
 * @param {string} code 
 */
const addBingoCode = code => {
    const sha = sha256(code);
    savedBingoCodes.set(sha, code);
};

/**
 * Save bingo codes to local storage
 */
const saveBingoCodes = () => {
    const codes = [...savedBingoCodes];

    localStorage.setItem('bingoCodes', JSON.stringify(codes));
    console.log('Saved bingo codes to local storage:', codes);
};

/**
 * Load bingo codes from local storage
 * @returns {Map<string, string>} savedBingoCodes
 */
const loadBingoCodes = () => {
    try {
        const codes = JSON.parse(localStorage.getItem('bingoCodes'));

        for (const [sha, code] of codes) 
            savedBingoCodes.set(sha, code);
    
        console.log('Loaded bingo from local storage:', savedBingoCodes);

    } catch (e) {
        localStorage.setItem('bingoCodes', '[]');
    }

    return savedBingoCodes;
};

class PersistentInput {
    /**
     * Create a new persistent input
     * @param {string} id 
     */
    constructor(id) {
        this.id = id;
        this.input = document.getElementById(id);
        this.value = localStorage.getItem(`persistent-${id}`);

        // if (this.value === null)
        //     this.value = false;
    }

    init() {
        if (!this.input) {
            console.error(`Input with id ${this.id} not found`);
            return;
        }

        if (this.value !== null)
            this.input.value = this.value;

        this.input.addEventListener('input', () => {
            this.setState(this.input.value);
        });
    }

    /**
     * Save the input value to local storage
     */
    setState(value) {
        localStorage.setItem(`persistent-${this.id}`, value);
        this.value = value;
        this.input.value = value;
    }

    /**
     * Load the input value from local storage
     */
    getState() {
        this.value = localStorage.getItem(`persistent-${this.id}`);
        this.input.value = this.value;
        return this.value;
    }
}

class PersistentCheckbox extends PersistentInput {
    init() {
        if (!this.input) {
            console.error(`Checkbox with id ${this.id} not found`);
            return;
        }

        if (this.value === 'true')
            this.input.checked = true;

        this.input.addEventListener('click', () => {
            this.setState(this.input.checked);
        });
    }

    /**
     * Save the input value to local storage
     */
    setState(value) {
        localStorage.setItem(`persistent-${this.id}`, value);
        this.value = value;
        this.input.checked = value;
    }

    /**
     * Load the input value from local storage
     */
    getState() {
        this.value = localStorage.getItem(`persistent-${this.id}`);
        this.input.checked = this.value === 'true';
        return this.value;
    }
}

const checkboxes = ['menu-toggle'];

for (const id of checkboxes) {
    const input = new PersistentCheckbox(id);
    input.init();
}