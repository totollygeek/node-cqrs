import {
    PetitionCreatedEventHandler,
    PetitionClosedEventHandler,
    SignerAddedEventHandler,
    SignerRemovedEventHandler,
} from './EventHandlers';

export const EventHandlers = [
    PetitionCreatedEventHandler,
    PetitionClosedEventHandler,
    SignerAddedEventHandler,
    SignerRemovedEventHandler,
];
