import React, { useEffect } from 'react';
import WorkoutDetails from '../components/WorkoutDetails';
import WorkoutForm from '../components/WorkoutForm';
import { useWorkoutsContext } from '../hooks/useWorkoutsContext';
import { useAuthContext } from '../hooks/useAuthContext';

const Home = () => {
	const { workouts, workout, dispatch } = useWorkoutsContext();
	const { user } = useAuthContext();

	useEffect(() => {
		const fetchWorkouts = async () => {
			const response = await fetch('/api/workouts', {
				headers: { Authorization: `Bearer ${user.token}` },
			});
			const json = await response.json();
			if (response.ok) {
				dispatch({ type: 'SET_WORKOUTS', payload: json });
			}
		};

		if (user) {
			fetchWorkouts();
		}
	}, [dispatch, user]);

	const handleClick = (workout) => {
		// console.log(`Workout clicked is: ${workout.title}`);
		dispatch({ type: 'SET_WORKOUT', payload: workout });
	};

	console.log(workout, workouts);
	return (
		<div className="home">
			<div className="workouts">
				{workouts &&
					workouts.map((workout) => (
						<WorkoutDetails
							key={workout._id}
							workout={workout}
							onClick={() => handleClick(workout)}
						>
							{workout.title}
						</WorkoutDetails>
					))}
			</div>
			<WorkoutForm />
		</div>
	);
};

export default Home;
