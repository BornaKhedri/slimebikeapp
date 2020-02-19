// Stateless machine definition
// machine.transition(...) is a pure function used by the interpreter.

const slimebikeMachine = XState.Machine({
    id: 'slimebike_machine',
    initial: 'start',
    states: {
        start: {
            entry: ['getCity'], // Get the city in which the app was used
            on: {
                PERMITTING: 'classification'
            }
        },
        classification: {
            entry: ['populateCompanies', 'populateInfractions'], // for the city, get the companies, infractions etc.
            on: {
                IMAGING: 'location'
            }
        },
        location: {
            on: {
                PINPOINTING: 'identification'
            }
        },
        identification: {
            on: {
                RECOGNIZING: 'done'
            }
        },
        done: {

        }
    }, 
    actions: {
        getCity: getCity(), 
        populateCompanies: populateCompanies(), 
        populateInfractions: populateInfractions()
    }
});

// Machine instance with internal state
const slimeBikeService = XState.interpret(slimebikeMachine)
    .onTransition(state => console.log(state.value))
    .start();
// => 'inactive'


// => 'active'


// => 'inactive'