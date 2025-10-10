import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Container,
  Header,
  Segment,
  FormField,
  Form,
  Button,
  Grid,
  ListItem,
  ListHeader,
  ListContent,
  Input,
  List,
  GridColumn,
} from "semantic-ui-react";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import copy from "clipboard-copy";
import { addNote, removeNote } from "../store";

export const CopyToClipboard = ({ copyText }) => {
  const [isCopied, setIsCopied] = useState(false);
  const handleCopy = () => {
    copy(copyText).then(() => {
      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
      }, 3000);
    });
  };
  return (
    <Button color="teal" disabled={isCopied} onClick={handleCopy}>
      {isCopied ? "Copied!" : "Copy"}
    </Button>
  );
};
export default function QuuiNoteList() {
  // toasfity message
  const toastifyPosted = (quuiNote) => toast("Successfully added " + quuiNote);
  const toastifyDeleted = () => toast("Successfully deleted");
  const toastifyEdited = (editedNote) =>
    toast("Successfully edited " + editedNote);
  const toasfityErrorMessage = (errorMessage) =>
    toast("Error: " + errorMessage);
  const toastifyFetched = () =>
    toast("Successfully retrieved existing note(s).");
  const toastifyAlreadyFetchedError = () =>
    toast("Already fetched the existing note(s).");
  const toastifyNoExistingNote = () => toast("No exsiting note(s).");

  const quuiNoteList = useSelector((state) => {
    return state.notes;
  });

  const dispatch = useDispatch();
  const [inputValue, setInputValue] = useState("");
  const [quuiNoteId, setQuuiNoteId] = useState("");
  const [searchByKeyword, setSearchByKeyword] = useState("");
  const [, setChangeDetails] = useState(false);

  const style = {
    h1: {
      marginTop: "3em",
      color: "white",
    },
    h2: {
      margin: "4em 0em 2em",
    },
    h3: {
      marginTop: "2em",
      padding: "2em 0em",
    },
    last: {
      marginBottom: "300px",
    },
    quui: {
      color: "white",
      background: "black",
    },
  };
  const handleFetchExistingData = async () => {
    if (renderedNotes[0] == null) {
      const headers = new Headers({
        "Content-Type": "application/json",
      });

      const requestOptions = {
        headers: headers,
      };
      await fetch("https://enqjhcnlm-xxkp9rtjij68q.free.beeceptor.com/api/quuilite", requestOptions)
        .then((response) => response.json())
        .then((result) => {
          console.log(result);
          const tmpQuui = result;
          tmpQuui.forEach(function (el) {
            console.log(el);
            dispatch(addNote(el.quuiNote + el.id));
          });
          if (tmpQuui.length === 0) {
            toastifyNoExistingNote();
          } else {
            toastifyFetched();
          }
        })

        .catch((error) => {
          toasfityErrorMessage(error);
        });
    } else {
      toastifyAlreadyFetchedError();
    }
  };
  const postApi = async (e) => {
    e.preventDefault();
    const quuiNote = e.currentTarget.inputQuuiNote.value;
    e.currentTarget.inputQuuiNote.value = "";

    const headers = new Headers({
      "Content-Type": "application/json"
    });

    const requestOptions = {
      method: "POST",
      headers: headers,
      body: JSON.stringify({ quuiNote }),
    };
    await fetch("https://enqjhcnlm-xxkp9rtjij68q.free.beeceptor.com/api/quuilite", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        dispatch(addNote(result.quuiNote + result.id));
      })
      .then(toastifyPosted(quuiNote))
      .catch((error) => {
        toasfityErrorMessage(error);
      });
  };
  const handleNoteEdit = async () => {
    console.log(inputValue);
    const quuiNote = inputValue;
    console.log(quuiNoteId);
    const headers = new Headers({
      "Content-Type": "application/json"
    });
    const requestOptions = {
      method: "PUT",
      headers: headers,
      body: JSON.stringify({ quuiNote }),
    };
    console.log(requestOptions);
    await fetch(
      "https://enqjhcnlm-xxkp9rtjij68q.free.beeceptor.com/api/quuilite/" + quuiNoteId,
      requestOptions
    )
      .then((response) => response.json())

      .then((result) => {
        console.log(result);
      })
      .then(toastifyEdited(quuiNote))
      .catch((error) => {
        toasfityErrorMessage(error);
      });
  };
  const handleNoteRemove = async (id) => {
    const headers = new Headers({
      "Content-Type": "application/json"

    });
    const requestOptions = {
      method: "DELETE",
      headers: headers,
    };

    await fetch(
      "https://enqjhcnlm-xxkp9rtjij68q.free.beeceptor.com/api/quuilite/" + id.slice(-20),
      requestOptions
    )
      .then((response) => console.log(response.json()))
      .then((result) => console.log(result))
      .then(toastifyDeleted())
      .catch((error) => {
        toasfityErrorMessage(error);
      });

    dispatch(removeNote(id));
  };
  const renderedNotes = Array.from(
    new Set(
      quuiNoteList.filter((el) => {
        return el.includes(searchByKeyword);
      })
    )
  ).map((id) => {
    return (
      <Grid key={id}>
        <GridColumn textAlign="center">
          <List horizontal>
            <ListItem>
              <ListContent>
                <CopyToClipboard copyText={id.slice(0, -20)} />
              </ListContent>
            </ListItem>
            <ListItem>
              <Form size="huge">
                <FormField>
                  <Input
                    className="inputField"
                    onChange={(e) => setInputValue(e.target.value)}
                    onChangeCapture={() => setQuuiNoteId(id.slice(-20))}
                    defaultValue={id.slice(0, -20)}
                    name="editQuuiNote"
                  />
                </FormField>
              </Form>
            </ListItem>
            <ListItem>
              <ListContent>
                <ListHeader
                  onClick={() => {
                    handleNoteEdit();
                    setChangeDetails((prevState) => !prevState);
                  }}
                >
                  <Button color="blue" inverted>
                    Edit
                  </Button>
                </ListHeader>
              </ListContent>
            </ListItem>
            <ListItem>
              <Button onClick={() => handleNoteRemove(id)} color="red">
                X
              </Button>
            </ListItem>
          </List>
        </GridColumn>
      </Grid>
    );
  });
  

  return (
    <>
      <Grid textAlign="center" style={{ margin: "1vh" }} verticalAlign="middle">
        {" "}
        <Form onSubmit={handleFetchExistingData}>
          <Button content="Load existing note(s)" icon="play" size="small" />
        </Form>{" "}
        <Input
          placeholder="Search by keyword..."
          size="large"
          onChange={(e) => setSearchByKeyword(e.target.value)}
        />
      </Grid>
      <Grid
        textAlign="center"
        style={{ height: "35vh" }}
        verticalAlign="middle"
      >
        <Grid.Column style={{ maxWidth: 450 }}>
          <Header as="h1" icon inverted textAlign="center">
            QuuiLite - enabled by beeceptor.com {searchByKeyword}
          </Header>{" "}
          <Form size="large" onSubmit={postApi}>
            <FormField>
              <input
                name="inputQuuiNote"
                placeholder="Type note and hit Enter key ..."
              />
            </FormField>
          </Form>{" "}
        </Grid.Column>
      </Grid>
      <Container text>
        {" "}
        <Segment.Group>
          <Segment style={style.quui}>{renderedNotes}</Segment>{" "}
        </Segment.Group>
      </Container>
      <ToastContainer />
    </>
  );
}
