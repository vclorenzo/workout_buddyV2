import { createContext, useReducer, useMemo } from 'react';

export const WorkoutsContext = createContext();

export const workoutsReducer = (state, action) => {
	switch (action.type) {
		case 'SET_WORKOUTS':
			return {
				workouts: action.payload,
			};

		case 'SET_WORKOUT':
			return {
				...state,
				workout: action.payload,
			};
		case 'CREATE_WORKOUT':
			return {
				workouts: [action.payload, ...state.workouts],
			};
		case 'UPDATE_WORKOUT':
			const updatedWorkouts = state.workouts.map((workout) => {
				if (workout._id === action.payload._id) {
					return action.payload;
				}
				return workout;
			});
			return {
				workouts: updatedWorkouts,
			};
		case 'DELETE_WORKOUT':
			return {
				workouts: state.workouts.filter(
					(workout) => workout._id !== action.payload._id
				),
			};
		default:
			return state;
	}
};

export const WorkoutsContextProvider = ({ children }) => {
	const [state, dispatch] = useReducer(workoutsReducer, {
		workouts: null,
		workout: null,
	});

	// Memoize the context value to avoid unnecessary re-renders
	const contextValue = useMemo(
		() => ({ ...state, dispatch }),
		[state, dispatch]
	);

	return (
		<WorkoutsContext.Provider value={contextValue}>
			{children}
		</WorkoutsContext.Provider>
	);
};
