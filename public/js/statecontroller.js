// Stateless machine definition
// machine.transition(...) is a pure function used by the interpreter.

const slimebikeMachine = XState.Machine({
    id: 'slimebike_machine',
    initial: 'start',
    states: {
        start: {
            on: {
                PERMITTING: 'classification'
            }
        },
        classification: {
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
    }
});

// Machine instance with internal state
const slimeBikeService = XState.interpret(slimebikeMachine)
    .onTransition(state => console.log(state.value))
    .start();
// => 'inactive'
slimeBikeService.send('PERMITTING');

// => 'active'


// => 'inactive'