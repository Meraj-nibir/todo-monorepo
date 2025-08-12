import { ConvexProviderWithAuth, convex } from '@todo/convex-client';
//import { useAuth } from '@convex-dev/auth/react';
import { useMutation, useQuery } from 'convex/react';
//import { api } from './convex/_generated/api';
import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default function App() {
  return (
    <ConvexProviderWithAuth client={convex}>
      <TodoApp />
    </ConvexProviderWithAuth>
  );
}

function TodoApp() {
  const { isAuthenticated, signOut } = useAuth();
  const tasks = useQuery(api.tasks.getTasks) || { current: [], completed: [] };
  const addTask = useMutation(api.tasks.addTask);
  const markComplete = useMutation(api.tasks.markComplete);
  const [newTask, setNewTask] = useState('');

  if (!isAuthenticated) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>To-Do App</Text>
        <Text style={styles.link}>Please log in or sign up</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Text style={styles.title}>My To-Do List</Text>
      <TouchableOpacity onPress={signOut}>
        <Text style={styles.logout}>Logout</Text>
      </TouchableOpacity>
      <TextInput
        style={styles.input}
        value={newTask}
        onChangeText={setNewTask}
        placeholder="Enter a new task"
      />
      <TouchableOpacity
        style={styles.addButton}
        onPress={async () => {
          if (newTask) {
            await addTask({ title: newTask });
            setNewTask('');
          }
        }}
      >
        <Text style={styles.buttonText}>Add Task</Text>
      </TouchableOpacity>
      <Text style={styles.sectionTitle}>Current Tasks</Text>
      <FlatList
        data={tasks.current}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.task}>
            <Text style={styles.taskText}>{item.title}</Text>
            <TouchableOpacity
              onPress={() => markComplete({ id: item._id })}
              style={styles.completeButton}
            >
              <Text style={styles.buttonText}>Done</Text>
            </TouchableOpacity>
          </View>
        )}
        style={styles.list}
      />
      <Text style={styles.sectionTitle}>Completed Tasks</Text>
      <FlatList
        data={tasks.completed}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.task}>
            <Text style={[styles.taskText, styles.completed]}>{item.title}</Text>
          </View>
        )}
        style={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 40,
    marginBottom: 10,
    textAlign: 'center',
  },
  logout: {
    color: '#ff4444',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  addButton: {
    backgroundColor: '#007bff',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 10,
    marginBottom: 5,
  },
  task: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#eee',
  },
  taskText: {
    fontSize: 16,
    flex: 1,
  },
  completed: {
    textDecorationLine: 'line-through',
    color: '#888',
  },
  completeButton: {
    backgroundColor: '#28a745',
    padding: 8,
    borderRadius: 6,
  },
  list: {
    flexGrow: 0,
  },
  link: {
    color: '#007bff',
    textAlign: 'center',
  },
});