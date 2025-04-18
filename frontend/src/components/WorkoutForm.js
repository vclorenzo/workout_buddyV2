import React, { useEffect, useState } from 'react';
import { useWorkoutsContext } from '../hooks/useWorkoutsContext';
import { useAuthContext } from '../hooks/useAuthContext';

const WorkoutForm = () => {
	const { dispatch } = useWorkoutsContext();
	const [title, setTitle] = useState('');
	const [load, setLoad] = useState('');
	const [reps, setReps] = useState('');
	const [error, setError] = useState(null);
	const [emptyFields, setEmptyFields] = useState([]);

	const { user } = useAuthContext();
	const { workout } = useWorkoutsContext();

	useEffect(() => {
		setTitle(workout?.title ?? '');
		setLoad(workout?.load ?? '');
		setReps(workout?.reps ?? '');
	}, [workout]);

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!user) {
			setError('You must be logged in');
			return;
		}
		const workout = { title, load, reps };
		const response = await fetch('/api/workouts', {
			method: 'POST',
			body: JSON.stringify(workout),
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${user.token}`,
			},
		});

		const json = await response.json();

		if (!response.ok) {
			setError(json.error);
			setEmptyFields(json.emptyFields ?? []);
		}

		if (response.ok) {
			setTitle('');
			setLoad('');
			setReps('');
			setError(null);
			setEmptyFields([]);
			console.log('new workout added:', json);
			dispatch({ type: 'CREATE_WORKOUT', payload: json });
		}
	};

	const handleUpdate = async (e) => {
		e.preventDefault();

		if (!user) {
			setError('You must be logged in');
			return;
		}
		const updatedWorkout = { title, load, reps };
		const response = await fetch('/api/workouts/' + workout._id, {
			method: 'PATCH',
			body: JSON.stringify(updatedWorkout),
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${user.token}`,
			},
		});

		const json = await response.json();

		if (!response.ok) {
			setError(json.error);
			setEmptyFields(json.emptyFields ?? []);
		}

		if (response.ok) {
			setTitle('');
			setLoad('');
			setReps('');
			setError(null);
			setEmptyFields([]);
			console.log('new workout added:', json);
			dispatch({ type: 'UPDATE_WORKOUT', payload: json });
			dispatch({ type: 'SET_WORKOUT', payload: null });
		}
	};

	return (
		<form
			className="create"
			// onSubmit={handleSubmit}
		>
			<h3>Add a new workout</h3>
			<label htmlFor="title">Exercise Title</label>
			<input
				type="text"
				id="title"
				onChange={(e) => setTitle(e.target.value)}
				value={title}
				className={emptyFields.includes('title') ? 'error' : ''}
			/>
			<label htmlFor="load">Load (in kg)</label>
			<input
				type="text"
				id="load"
				onChange={(e) => setLoad(e.target.value)}
				value={load}
				className={emptyFields.includes('load') ? 'error' : ''}
			/>
			<label htmlFor="rep">Reps</label>
			<input
				type="text"
				id="rep"
				onChange={(e) => setReps(e.target.value)}
				value={reps}
				className={emptyFields.includes('reps') ? 'error' : ''}
			/>
			{workout ? (
				<button onClick={handleUpdate}>Update</button>
			) : (
				<button onClick={handleSubmit}>Add</button>
			)}

			{error && <div className="error">{error}</div>}
		</form>
	);
};

export default WorkoutForm;
