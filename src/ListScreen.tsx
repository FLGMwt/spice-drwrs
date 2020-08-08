import React, { useEffect, useMemo, useState } from "react";
import { FlatList, View } from "react-native";
import {
  Button,
  Text,
  Card,
  Title,
  useTheme,
  Modal,
  Portal,
  TextInput,
  Switch,
  Chip,
  Headline,
} from "react-native-paper";
import * as firebase from "firebase";

type Spice = {
  id: string;
  name: string;
  note: string;
  haveExtra: boolean;
  runningLow: boolean;
  outOfStock: boolean;
};

const SpiceCard: React.FC<{ spice: Spice; onEdit: (spice: Spice) => void }> = ({
  spice,
  onEdit,
}) => {
  const chips = [
    spice.outOfStock && (
      <Chip style={{ margin: 4 }} key="out">
        Out of stock 😡
      </Chip>
    ),
    spice.runningLow && (
      <Chip style={{ margin: 4 }} key="low">
        Running low 😯
      </Chip>
    ),
    spice.haveExtra && (
      <Chip style={{ margin: 4 }} key="extra">
        Have extra 😎
      </Chip>
    ),
  ].filter(Boolean);
  return (
    <Card style={{ margin: 4 }} onLongPress={() => onEdit(spice)}>
      <Card.Title title={spice.name} subtitle={spice.note} />
      {chips.length > 0 ? (
        <Card.Content style={{ flexDirection: "row", flexWrap: "wrap" }}>
          {chips}
        </Card.Content>
      ) : null}
    </Card>
  );
};

type EditingSpice = Spice & { editingLabel: string };

const SwitchInput = ({ label, value, onChange }) => {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginVertical: 8,
      }}
    >
      <Text>{label}</Text>
      <Switch value={value} onValueChange={onChange} />
    </View>
  );
};

const ListScreen = () => {
  const db = useMemo(() => firebase.firestore(), []);
  const [spices, setSpices] = useState([] as any[]);
  const [editingSpice, setEditingSpice] = useState<null | EditingSpice>(null);
  useEffect(() => {
    const cancel = db
      .collection("spices")
      .onSnapshot((snapshot) =>
        setSpices(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })))
      );
    return cancel;
  }, []);

  const onSave = async () => {
    if (!editingSpice) return;
    const { editingLabel, id, ...updatedSpice } = editingSpice;
    setEditingSpice(null);
    if (id) {
      await db.doc(`spices/${editingSpice.id}`).set(updatedSpice);
    } else {
      await db.collection("spices").add(updatedSpice);
    }
  };
  const {
    colors: { background },
  } = useTheme();
  return (
    <Portal>
      <>
        <View
          style={{
            flex: 1,
            backgroundColor: background,
            paddingTop: 24,
            paddingHorizontal: 8,
          }}
        >
          <Headline>My Spices</Headline>
          <FlatList
            data={spices}
            renderItem={({ item }) => (
              <SpiceCard
                spice={item}
                onEdit={() =>
                  setEditingSpice({ ...item, editingLabel: item.name })
                }
              />
            )}
            ListFooterComponent={() => (
              <Button
                style={{ margin: 8 }}
                mode="contained"
                onPress={() =>
                  setEditingSpice({
                    name: "",
                    id: "",
                    editingLabel: "New Spice",
                    note: "",
                    haveExtra: false,
                    runningLow: false,
                    outOfStock: false,
                  })
                }
              >
                Add spice
              </Button>
            )}
          />
        </View>

        <Modal visible={!!editingSpice} onDismiss={() => setEditingSpice(null)}>
          {!!editingSpice ? (
            <View
              style={{ backgroundColor: background, margin: 8, padding: 16 }}
            >
              <Title>Editing: {editingSpice.editingLabel}</Title>
              <TextInput
                label="Name"
                value={editingSpice.name}
                onChangeText={(text) =>
                  setEditingSpice((state) => state && { ...state, name: text })
                }
                style={{ marginVertical: 8 }}
              />
              <TextInput
                label="Note"
                value={editingSpice.note}
                onChangeText={(text) =>
                  setEditingSpice((state) => state && { ...state, note: text })
                }
                style={{ marginVertical: 8 }}
              />
              <SwitchInput
                label="Out of stock?"
                value={editingSpice.outOfStock}
                onChange={() =>
                  setEditingSpice(
                    (state) =>
                      state && { ...state, outOfStock: !state.outOfStock }
                  )
                }
              />
              <SwitchInput
                label="Running low?"
                value={editingSpice.runningLow}
                onChange={() =>
                  setEditingSpice(
                    (state) =>
                      state && { ...state, runningLow: !state.runningLow }
                  )
                }
              />
              <SwitchInput
                label="Have extra?"
                value={editingSpice.haveExtra}
                onChange={() =>
                  setEditingSpice(
                    (state) =>
                      state && { ...state, haveExtra: !state.haveExtra }
                  )
                }
              />
              <View style={{ justifyContent: "flex-end" }}>
                <Button onPress={onSave}>Save</Button>
              </View>
            </View>
          ) : null}
        </Modal>
      </>
    </Portal>
  );
};

export default ListScreen;
