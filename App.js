import React from "react";

import {
  Alert,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Keyboard,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const COLORS = {
  primary: "#1f145c",
  white: "#fff",
};

const App = () => {
  const [textInput, setTextInput] = React.useState("");

  const [todos, setTodos] = React.useState([]);

  React.useEffect(() => {
    getTodosFromUsersDevice();
  }, []);

  React.useEffect(() => {
    saveTodoToUserDevice(todos);
  }, [todos]);

  const ListItem = ({ todo }) => {
    return (
      <View style={styles.listItem}>
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontWeight: "bold",
              fontSize: 15,
              color: todo?.completed ? "gray" : COLORS.primary,
              textDecorationLine: todo?.completed ? "line-through" : "none",
            }}
          >
            {todo?.task}
          </Text>
        </View>
        {!todo?.completd && (
          <TouchableOpacity
            style={styles.actionIcon}
            onPress={() => {
              markTodoComplete(todo?.id);
            }}
          >
            <Icon name="check" size={20} color={COLORS.white} />
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[styles.actionIcon, { backgroundColor: "red" }]}
        >
          <Icon
            name="delete"
            size={20}
            color={COLORS.white}
            onPress={() => {
              deleteTodo(todo?.id);
            }}
          />
        </TouchableOpacity>
      </View>
    );
  };

  const getTodosFromUsersDevice = async () => {
    try {
      const todos = await AsyncStorage.getItem("todos");

      if (todos != null) {
        setTodos(JSON.parse(todos));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const addTodo = () => {
    Keyboard.dismiss();
    if (textInput === "") {
      Alert.alert(
        "Algo deu errado",
        "Não é possivel inserir uma tarefa em branco"
      );
    } else {
      console.log(textInput);

      const newTodo = {
        id: Math.random(),
        task: textInput,
        completd: false,
      };
      setTodos([...todos, newTodo]);
      setTextInput("");
    }
  };

  const markTodoComplete = (todoId) => {
    const newTodos = todos.map((item) => {
      if (item.id == todoId) {
        console.log(item.completed);
        return { ...item, completed: !item.completed };
      }
      return item;
    });
    setTodos(newTodos);
  };

  const deleteTodo = (todoId) => {
    const newTodos = todos.filter((item) => item.id != todoId);
    Alert.alert("Deseja apagar esta tarefa?", "", [
      {
        text: "Sim",
        onPress: () => {
          setTodos(newTodos);
        },
      },
      { text: "Não" },
    ]);
  };

  const clearTodos = () => {
    Alert.alert("Confirmação", "deseja apagar todas as tarefas?", [
      { text: "Sim", onPress: () => setTodos([]) },
      { text: "Não" },
    ]);
  };

  const saveTodoToUserDevice = async (todos) => {
    try {
      const stringfyTodos = JSON.stringify(todos);
      await AsyncStorage.setItem("todos", stringfyTodos);
    } catch (e) {
      console.log(e);
      // saving error
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
      <View style={styles.header}>
        <Text
          style={{ fontWeight: "bold", fontSize: 20, color: COLORS.primary }}
        >
          TODO APP
        </Text>
        <Icon name="delete" size={25} color={"red"} onPress={clearTodos} />
      </View>
      <FlatList
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
        data={todos}
        renderItem={({ item }) => <ListItem todo={item} />}
      />
      <View style={styles.footer}>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Add Todo"
            value={textInput}
            onChangeText={(text) => setTextInput(text)}
          />
        </View>
        <TouchableOpacity style={styles.iconContainer} onPress={addTodo}>
          <Icon name="plus" color={COLORS.white} size={30} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  actionIcon: {
    height: 25,
    width: 25,
    backgroundColor: "green",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 5,
    borderRadius: 3,
  },
  listItem: {
    padding: 20,
    backgroundColor: COLORS.white,
    flexDirection: "row",
    elevation: 12,
    borderRadius: 7,
    marginVertical: 10,
  },

  header: {
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  footer: {
    position: "absolute",
    bottom: 0,
    color: COLORS.white,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  inputContainer: {
    backgroundColor: COLORS.white,
    elevation: 40,
    flex: 1,
    height: 50,
    marginVertical: 20,
    marginRight: 20,
    borderRadius: 30,
    paddingHorizontal: 20,
    justifyContent: "center",
  },
  iconContainer: {
    height: 50,
    width: 50,
    backgroundColor: COLORS.primary,
    borderRadius: 25,
    elevation: 40,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default App;
