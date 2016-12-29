declare class Recognizer {
    set(options: HammerRecognizerOptions);
    state: number;
}

declare interface HammerRecognizerOptions {
    direction?: number;
    domEvents?: boolean;
    threshold?: number;
    enable?: boolean;
}

declare interface TouchInput {
    callback: (manager, eventType, input) => void
    domHandler: (ev) => void;
    element: HTMLElement;
    evTarget: string;
}

type PanEventName = 'pan' | 'panstart' | 'panmove' | 'pancancel' | 'panend' | 'panup' | 'pandown' | 'panleft' | 'panright';
declare interface Manager {
    new (element: HTMLElement);//, options: Object = undefined
    new (element: HTMLElement, options: Object);//, options: Object = undefined

    element: HTMLElement;
    handlers: { [idnex: string]: Array<Function> };
    input: TouchInput;

    on(event: PanEventName, callback: (event: any) => void);
    get(recognizer: 'pan' | 'pinch' | 'rotate' | 'swipe'): Recognizer;
    add(recognizer: Recognizer);
}

interface Pan extends Recognizer {
    new (options?: HammerRecognizerOptions);
}

interface Swipe extends Recognizer {
}

interface Point {
    x: number,
    y: number
}

interface HammerInstance {
    on(event: PanEventName, callback: (event: PanEvent) => void);
    get(recognizerName: 'pan'): Pan;
    get(recognizerName: 'swipe'): Swipe;
    get(recognizerName: 'pan' | 'pinch' | 'rotate' | 'swipe'): any;
}

interface PanEvent extends Event {
    angle: number
    center: Point
    changedPointers: Array<any>
    deltaTime: number
    deltaX: number
    deltaY: number
    direction: number
    distance: number
    eventType: number
    isFinal: boolean
    isFirst: boolean
    offsetDirection: number
    pointerType: string
    pointers: Array<any>
    rotation: number
    scale: number
    srcEvent: TouchEvent
    target: HTMLElement
    timeStamp: number
    type: string
    velocity: number
    velocityX: number
    velocityY: number
}

declare interface HammerStatic {
    INPUT_START: number;
    INPUT_MOVE: number;
    INPUT_END: number;
    INPUT_CANCEL: number;

    STATE_POSSIBLE: number;
    STATE_BEGAN: number;
    STATE_CHANGED: number;
    STATE_ENDED: number;
    STATE_RECOGNIZED: number;
    STATE_CANCELLED: number;
    STATE_FAILED: number;

    DIRECTION_NONE: number;
    DIRECTION_LEFT: number;
    DIRECTION_RIGHT: number;
    DIRECTION_UP: number;
    DIRECTION_DOWN: number;
    DIRECTION_ALL: number;
    DIRECTION_HORIZONTAL: number;
    DIRECTION_VERTICAL: number;

    new (element: HTMLElement, options: any): HammerInstance;

    Recognizer: Recognizer;
    TouchInput: TouchInput;
    Manager: Manager;
    Pan: Pan;
    Point: Point;
    PanEvent: PanEvent;
}


declare module 'hammer' {
    let hammer: HammerStatic
    export = hammer;
}



