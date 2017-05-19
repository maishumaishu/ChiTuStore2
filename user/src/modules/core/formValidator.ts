/*
 * version 1.0
 */

function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
}

interface ValidatorError {
    id: string,
    display: string,
    element: HTMLInputElement,
    name: string,
    message: string,
    // messages: string[],
    rule: (...params) => boolean,
    //errorMessageElements: HTMLElement[]
}

let Errors = {
    ruleNotExists(name: string) {
        return new Error(`Rule named ${name} is not exists.`);
    }
}

interface Rule {
    name: string,
    params: string[]
}

interface ValidateField {
    id?: string,
    name?: string,
    //names?: string,
    depends?: () => boolean | string,
    display?: string,
    element?: HTMLInputElement,
    // type?: string,
    rules: Array<string | Rule>,
    value?: string | boolean,
    // checked?: boolean
    messages?: { [name: string]: string }
}

var defaults = {
    messages: {
        required: '%s 不允许为空',
        matches: '%s 与 %s 不匹配',
        "default": 'The %s field is still set to default, please change.',
        valid_email: '%s 不是有效的邮箱地址',
        valid_emails: 'The %s field must contain all valid email addresses.',
        min_length: '%s 至少包含 %s 个字符',
        max_length: '%s 不能超过 %s 字符',
        exact_length: 'The %s field must be exactly %s characters in length.',
        greater_than: 'The %s field must contain a number greater than %s.',
        less_than: 'The %s field must contain a number less than %s.',
        alpha: 'The %s field must only contain alphabetical characters.',
        alpha_numeric: 'The %s field must only contain alpha-numeric characters.',
        alpha_dash: 'The %s field must only contain alpha-numeric characters, underscores, and dashes.',
        numeric: 'The %s field must contain only numbers.',
        integer: 'The %s field must contain an integer.',
        decimal: 'The %s field must contain a decimal number.',
        is_natural: 'The %s field must contain only positive numbers.',
        is_natural_no_zero: 'The %s field must contain a number greater than zero.',
        valid_ip: 'The %s field must contain a valid IP.',
        valid_base64: 'The %s field must contain a base64 string.',
        valid_credit_card: 'The %s field must contain a valid credit card number.',
        is_file_type: 'The %s field must contain only %s files.',
        valid_url: 'The %s field must contain a valid URL.',
        greater_than_date: 'The %s field must contain a more recent date than %s.',
        less_than_date: 'The %s field must contain an older date than %s.',
        greater_than_or_equal_date: 'The %s field must contain a date that\'s at least as recent as %s.',
        less_than_or_equal_date: 'The %s field must contain a date that\'s %s or older.',
        mobile: '%s 不是有效的手机号码'
    } as { [name: string]: string },

    hooks: {
        required: function (field) {
            var value = field.value;

            if ((field.type === 'checkbox') || (field.type === 'radio')) {
                return (field.checked === true);
            }

            return (value || '') != '';
        },

        "default": function (field, defaultName) {
            return field.value !== defaultName;
        },

        matches: (field, match) => {
            // var el = this.form.querySelector(`[name="${matchName}"]`) as HTMLInputElement;

            // if (el) {
            return field.value === match;
            // }

            // return false;
        },

        valid_email: function (field) {
            return emailRegex.test(field.value);
        },

        valid_emails: function (field) {
            var result = field.value.split(/\s*,\s*/g);

            for (var i = 0, resultLength = result.length; i < resultLength; i++) {
                if (!emailRegex.test(result[i])) {
                    return false;
                }
            }

            return true;
        },

        min_length: function (field, length) {
            if (!numericRegex.test(length)) {
                return false;
            }

            return (field.value.length >= parseInt(length, 10));
        },

        max_length: function (field, length) {
            if (!numericRegex.test(length)) {
                return false;
            }

            return (field.value.length <= parseInt(length, 10));
        },

        exact_length: function (field, length) {
            if (!numericRegex.test(length)) {
                return false;
            }

            return (field.value.length === parseInt(length, 10));
        },

        greater_than: function (field, param) {
            if (!decimalRegex.test(field.value)) {
                return false;
            }

            return (parseFloat(field.value) > parseFloat(param));
        },

        less_than: function (field, param) {
            if (!decimalRegex.test(field.value)) {
                return false;
            }

            return (parseFloat(field.value) < parseFloat(param));
        },

        alpha: function (field) {
            return (alphaRegex.test(field.value));
        },

        alpha_numeric: function (field) {
            return (alphaNumericRegex.test(field.value));
        },

        alpha_dash: function (field) {
            return (alphaDashRegex.test(field.value));
        },

        numeric: function (field) {
            return (numericRegex.test(field.value));
        },

        integer: function (field) {
            return (integerRegex.test(field.value));
        },

        decimal: function (field) {
            return (decimalRegex.test(field.value));
        },

        is_natural: function (field) {
            return (naturalRegex.test(field.value));
        },

        is_natural_no_zero: function (field) {
            return (naturalNoZeroRegex.test(field.value));
        },

        valid_ip: function (field) {
            return (ipRegex.test(field.value));
        },

        valid_base64: function (field) {
            return (base64Regex.test(field.value));
        },

        valid_url: function (field) {
            return (urlRegex.test(field.value));
        },

        valid_credit_card: function (field) {
            // Luhn Check Code from https://gist.github.com/4075533
            // accept only digits, dashes or spaces
            if (!numericDashRegex.test(field.value)) return false;

            // The Luhn Algorithm. It's so pretty.
            var nCheck = 0, nDigit = 0, bEven = false;
            var strippedField = field.value.replace(/\D/g, "");

            for (var n = strippedField.length - 1; n >= 0; n--) {
                var cDigit = strippedField.charAt(n);
                nDigit = parseInt(cDigit, 10);
                if (bEven) {
                    if ((nDigit *= 2) > 9) nDigit -= 9;
                }

                nCheck += nDigit;
                bEven = !bEven;
            }

            return (nCheck % 10) === 0;
        },

        is_file_type: function (field, type) {
            if (field.type !== 'file') {
                return true;
            }

            var ext = field.value.substr((field.value.lastIndexOf('.') + 1)),
                typeArray = type.split(','),
                inArray = false,
                i = 0,
                len = typeArray.length;

            for (i; i < len; i++) {
                if (ext.toUpperCase() == typeArray[i].toUpperCase()) inArray = true;
            }

            return inArray;
        },

        greater_than_date: function (field, date) {
            var enteredDate = this._getValidDate(field.value),
                validDate = this._getValidDate(date);

            if (!validDate || !enteredDate) {
                return false;
            }

            return enteredDate > validDate;
        },

        less_than_date: function (field, date) {
            var enteredDate = this._getValidDate(field.value),
                validDate = this._getValidDate(date);

            if (!validDate || !enteredDate) {
                return false;
            }

            return enteredDate < validDate;
        },

        greater_than_or_equal_date: function (field, date) {
            var enteredDate = this._getValidDate(field.value),
                validDate = this._getValidDate(date);

            if (!validDate || !enteredDate) {
                return false;
            }

            return enteredDate >= validDate;
        },

        less_than_or_equal_date: function (field, date) {
            var enteredDate = this._getValidDate(field.value),
                validDate = this._getValidDate(date);

            if (!validDate || !enteredDate) {
                return false;
            }

            return enteredDate <= validDate;
        },

        mobile: function (field): boolean {
            var value = field.value as string;
            return value.length == 11 && /^1[34578]\d{9}$/.test(value);
        }
    } as { [name: string]: (...params) => boolean },
    errorClassName: 'validationMessage',
    callback: function (errors: ValidatorError[], fields: ValidateField[], evt: Environment) {
        console.assert(evt != null && evt.validator instanceof FormValidator);
        for (let i = 0; i < errors.length; i++) {
            console.assert(errors[i].id != null && errors[i].id != '');
            let errorTextElementId = getErrorElementId(errors[i].element);
            let errorTextElement: HTMLElement = document.getElementById(errorTextElementId) as HTMLElement;
            if (errorTextElement == null) {
                errorTextElement = evt.formElement.querySelector(`.${errors[i].name}.${defaults.errorClassName}`) as HTMLElement;
                if (errorTextElement == null) {
                    errorTextElement = document.createElement('span');
                    errorTextElement.className = defaults.errorClassName;
                    let parent = errors[i].element.parentElement as HTMLElement;
                    if (errors[i].element.nextElementSibling) {
                        parent.insertBefore(errorTextElement, errors[i].element.nextElementSibling);
                    }
                    else {
                        parent.appendChild(errorTextElement);
                    }
                }
                errorTextElement.id = errorTextElementId;
            }

            errorTextElement.style.display = 'block';
            errorTextElement.innerHTML = errors[i].message;
        }

        let errorNames = errors.map(o => o.name);
        let successFields = fields.filter(o => errorNames.indexOf(o.name) < 0);
        let errorElements = successFields
            .map(o => o.element).filter(o => o != null)
            .map(o => document.getElementById(getErrorElementId(o))).filter(o => o != null);

        errorElements.forEach(o => {
            o.innerHTML = '';
            o.style.display = 'none';
        })
    }
};


//let errorElementIdPattern = '%s-error';
function getErrorElementId(inputElement: HTMLElement) {
    console.assert(inputElement != null);
    console.assert((inputElement.id || '') != '');
    return inputElement.id + '-error';
}


/*
 * Define the regular expressions that will be used
 */

var ruleRegex = /^(.+?)\[(.+)\]$/,
    numericRegex = /^[0-9]+$/,
    integerRegex = /^\-?[0-9]+$/,
    decimalRegex = /^\-?[0-9]*\.?[0-9]+$/,
    emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
    alphaRegex = /^[a-z]+$/i,
    alphaNumericRegex = /^[a-z0-9]+$/i,
    alphaDashRegex = /^[a-z0-9_\-]+$/i,
    naturalRegex = /^[0-9]+$/i,
    naturalNoZeroRegex = /^[1-9][0-9]*$/i,
    ipRegex = /^((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){3}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})$/i,
    base64Regex = /[^a-zA-Z0-9\/\+=]/i,
    numericDashRegex = /^[\d\-\s]+$/,
    urlRegex = /^((http|https):\/\/(\w+:{0,1}\w*@)?(\S+)|)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?$/,
    dateRegex = /\d{4}-\d{1,2}-\d{1,2}/;

/*
 * The exposed public object to validate a form:
 *
 * @param formNameOrNode - String - The name attribute of the form (i.e. <form name="myForm"></form>) or node of the form element
 * @param fields - Array - [{
 *     name: The name of the element (i.e. <input name="myField" />)
 *     display: 'Field Name'
 *     rules: required|matches[password_confirm]
 * }]
 * @param callback - Function - The callback after validation has been performed.
 *     @argument errors - An array of validation errors
 *     @argument event - The javascript event
 */

type ErrorCallback = (errors: ValidatorError[], fields: ValidateField[], evt: Environment) => void
type Environment = { formElement: HTMLElement, validator: FormValidator };
class FormValidator {
    private callback: ErrorCallback;
    private fields: { [propName: string]: ValidateField };
    private form: HTMLElement;
    private handlers: { [name: string]: (value) => any };
    private conditionals: { [propName: string]: Function };

    hooks: { [name: string]: (...params) => boolean };
    messages: { [name: string]: string };

    static defaults = defaults;

    constructor(form: HTMLElement, fields: { [propName: string]: ValidateField }, callback?: ErrorCallback) {
        if (!form)
            throw new Error(`Argument form can not be null.`);

        this.callback = callback || defaults.callback;
        this.fields = fields;
        this.form = form;
        this.handlers = {};
        this.conditionals = {};

        for (var name in fields) {
            fields[name].name = name;
            fields[name].messages = fields[name].messages || {};
            fields[name].display = fields[name].display || name;
        }

        this.hooks = Object.assign({}, defaults.hooks);
        this.messages = Object.assign({}, defaults.messages);
    }

    clearErrors(...fieldNames: string[]) {
        console.assert(fieldNames != null);
        //==========================================
        // 不传参数，清除所有错误。
        if (fieldNames.length == 0) {
            fieldNames = Object.getOwnPropertyNames(this.fields);
        }
        //==========================================

        let fields = fieldNames.map(fieldName => {
            let result = this.fields[fieldName];
            if (result == null)
                console.warn(`'${fieldName}' field is not exists.`);

            return result;
        }).filter(o => o != null);

        let errorElements = fields.filter(o => o.element != null)
            .map(o => document.getElementById(getErrorElementId(o.element)))
            .filter(o => o != null);

        for (let i = 0; i < errorElements.length; i++) {
            (errorElements[i] as HTMLElement).innerHTML = '';
            (errorElements[i] as HTMLElement).style.display = 'none';
        }
    }

    /*
    * @public
    * Registers a callback for a custom rule (i.e. callback_username_check)
    */
    registerCallback(name: string, handler: (value: string) => void) {
        if (name && typeof name === 'string' && handler && typeof handler === 'function') {
            this.handlers[name] = handler;
        }

        // return this for chaining
        return this;
    };


    /*
     * @public
     * Registers a conditional for a custom 'depends' rule
     */

    registerConditional(name, conditional) {
        if (name && typeof name === 'string' && conditional && typeof conditional === 'function') {
            this.conditionals[name] = conditional;
        }

        // return this for chaining
        return this;
    };

    /*
     * @public
     * Runs the validation when the form is submitted.
     */
    validateForm(): boolean {
        //this.clearErrors();
        return this._validateFields(this.fields);
    };

    validateFields(...fieldNames: string[]): boolean {
        fieldNames = fieldNames || new Array<string>();
        let fields: { [propName: string]: ValidateField } = {};
        for (let i = 0; i < fieldNames.length; i++) {
            let field = this.fields[fieldNames[i]];
            if (field == null) {
                console.warn(`Field '${fieldNames[i]}' is not exists.`)
                continue;
            }

            fields[fieldNames[i]] = field;
        }
        return this._validateFields(fields);
    }

    private _validateFields(fields: { [propName: string]: ValidateField }): boolean {
        //this.errors = [];
        let errors = [];
        for (var key in fields) {
            if (!this.fields.hasOwnProperty(key))
                continue;

            let field = this.fields[key];
            console.assert(field != null);

            let element = this.form.querySelector(`[name="${field.name}"]`) as HTMLInputElement;
            let elements = this.form.querySelectorAll(`[name="${field.name}"]`) as NodeListOf<HTMLInputElement>;
            if (!element)
                continue;

            // let elementId = element.id;
            if (!element.id) {
                element.id = guid();
            }

            field.id = element.id;
            field.element = element;
            // field.type = element.type;

            let value = FormValidator.attributeValue(elements, 'value');
            // if (typeof value == 'string')
            field.value = value; //attributeValue(elements, 'value') as string;
            // else
            //     field.checked = attributeValue(elements, 'checked') as boolean;

            /*
             * Run through the rules for each field.
             * If the field has a depends conditional, only validate the field
             * if it passes the custom function
             */
            let error: ValidatorError;
            if (field.depends && typeof field.depends === "function") {
                if (field.depends.call(this, field)) {
                    error = this._validateField(field);
                }
            } else if (field.depends && typeof field.depends === "string" && this.conditionals[<any>field.depends]) {
                if (this.conditionals[field.depends as any].call(this, field)) {
                    error = this._validateField(field);
                }
            } else {
                error = this._validateField(field);
            }

            if (error)
                errors.push(error);
        }


        if (typeof this.callback === 'function') {
            let _fields = Object.getOwnPropertyNames(fields).map(o => fields[o]);
            this.callback(errors, _fields, { formElement: this.form, validator: this });
        }

        if (errors.length > 0) {
            return false;
        }

        return true;
    }


    /*
     * @private
     * Looks at the fields value and evaluates it against the given rules
     */
    private _validateField(field: ValidateField): ValidatorError {
        var rules = this.hooks;
        var rule = {} as Rule;
        for (let i = 0; i < field.rules.length; i++) {
            let rule: Rule;
            if (typeof field.rules[i] == 'string') {
                rule = { name: field.rules[i] as string, params: null };
            }
            else {
                rule = field.rules[i] as Rule;
            }
            let func = rules[rule.name];
            if (func == null)
                throw Errors.ruleNotExists(rule.name);

            let params: any[] = [field];
            if (rule.params) {
                var arr = rule.params;
                for (let i = 0; i < arr.length; i++) {
                    var value: string | boolean;
                    for (let j = 0; j < rule.params.length; j++) {
                        var q = this.form.querySelectorAll(`[name="${rule.params[j]}"]`) as NodeListOf<HTMLInputElement>;
                        if (q.length > 0) {
                            var attrName: 'checked' | 'value' = (q[0].type == 'radio' || q[0].type == 'checkbox') ? 'checked' : 'value';
                            value = FormValidator.attributeValue(q, attrName);
                        }
                        params.push(value);
                    }

                }
            }
            var result = func(...params);
            if (!result) {
                let message = field.messages[rule.name] || this.messages[rule.name] || this.messages['default'];
                message = message.replace('%s', field.display);

                var errorObject: ValidatorError = {
                    id: field.id,
                    display: field.display,
                    element: field.element,
                    name: field.name,
                    message,
                    rule: func
                };
                return errorObject;
            }
        }

        return null;
    };

    /**
     * private function _getValidDate: helper function to convert a string date to a Date object
     * @param date (String) must be in format yyyy-mm-dd or use keyword: today
     * @returns {Date} returns false if invalid
     */
    private _getValidDate(date): boolean | Date {
        if (!date.match('today') && !date.match(dateRegex)) {
            return false;
        }

        var validDate = new Date(),
            validDateArray;

        if (!date.match('today')) {
            validDateArray = date.split('-');
            validDate.setFullYear(validDateArray[0]);
            validDate.setMonth(validDateArray[1] - 1);
            validDate.setDate(validDateArray[2]);
        }
        return validDate;
    };





    private static attributeValue(elements: NodeListOf<HTMLInputElement>, attributeName: 'value' | 'checked'): string | boolean {

        console.assert(elements != null);

        if (elements.length == 0)
            return null;

        if (elements.length == 1)
            return elements[0][attributeName];

        if (elements[0].type === 'radio' || elements[0].type === 'checkbox') {
            var i;
            let elementLength = elements.length;
            for (i = 0; i < elementLength; i++) {
                if (elements[i].checked) {
                    return elements[i][attributeName];
                }
            }
        }

        return null;
    };

}

export = FormValidator;


