import { Button, Form, FloatingLabel } from "react-bootstrap";
import { uploadToIpfs } from "../utils/minter";
import { useState } from "react";

const Add = ({save}) => {
  const [address, setAddress] = useState("");
  const [ipfsImage, setIpfsImage] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");

  const ARABLE = ["True", "False"];
  const LOCATION = ["Busy", "Remote", "Mixed"];
  const CONSTRUCTION = ["None", "Built", "Half Built"];

  //store attributes of an NFT
  const [attributes, setAttributes] = useState([]);

  const isFormFilled = () =>{
    return address && ipfsImage && description && attributes.length > 2;
   }

  const setAttributesFunc = (e, trait_type) => {
    const { value } = e.target;
    const attributeObject = {
      trait_type,
      value,
    };
    const arr = attributes;

    // check if attribute already exists
    const index = arr.findIndex((el) => el.trait_type === trait_type);

    if (index >= 0) {
      // update the existing attribute
      arr[index] = {
        trait_type,
        value,
      };
      setAttributes(arr);
      return;
    }

    // add a new attribute
    setAttributes((oldArray) => [...oldArray, attributeObject]);
  };
  return (
    <>
      <div className="modal-body p-5 pt-3">
        <h2>Create Your Land</h2>
        <Form>
          <FloatingLabel
            controlId="inputLocation"
            label="Address"
            className="mb-3"
          >
            <Form.Control
              type="text"
              placeholder="Address of Land"
              onChange={(e) => {
                setAddress(e.target.value);
              }}
            />
          </FloatingLabel>

          <FloatingLabel
            controlId="inputDescription"
            label="Description"
            className="mb-3"
          >
            <Form.Control
              as="textarea"
              placeholder="Description of Land"
              style={{ height: "80px" }}
              onChange={(e) => {
                setDescription(e.target.value);
              }}
            />
          </FloatingLabel>
          <FloatingLabel
            controlId="inputLocation"
            label="Price"
            className="mb-3"
          >
            <Form.Control
              type="text"
              placeholder="Price of Land"
              onChange={(e) => {
                setPrice(e.target.value);
              }}
            />
          </FloatingLabel>

          <Form.Control
            type="file"
            className={"mb-3"}
            onChange={async (e) => {
              const imageUrl = await uploadToIpfs(e);
              if (!imageUrl) {
                alert("failed to upload image");
                return;
              }
              setIpfsImage(imageUrl);
            }}
            placeholder="Product name"
          ></Form.Control>
          <Form.Label>
            <h5>Arability</h5>
          </Form.Label>
          <Form.Control
            as="select"
            className={"mb-3"}
            onChange={async (e) => {
              setAttributesFunc(e, "arability");
            }}
            placeholder="Land Properties"
          >
            <option hidden>Is Arable</option>
            {ARABLE.map((arable) => (
              <option
                key={`arable-${arable.toLowerCase()}`}
                value={arable.toLowerCase()}
              >
                {arable}
              </option>
            ))}
          </Form.Control>

          <Form.Control
            as="select"
            className={"mb-3"}
            onChange={async (e) => {
                setAttributesFunc(e, "location");
            }}
            placeholder="Land Location"
          >
            <option hidden>Location</option>
            {LOCATION.map((location) => (
              <option
                key={`location-${location.toLowerCase()}`}
                value={location.toLowerCase()}
              >
                {location}
              </option>
            ))}
          </Form.Control>
          <Form.Control
            as="select"
            className={"mb-3"}
            onChange={async (e) => {
                setAttributesFunc(e, "construction");
            }}
            placeholder="Construction"
          >
            <option hidden>Construction</option>
            {CONSTRUCTION.map((construction) => (
              <option
                key={`construction-${construction.toLowerCase()}`}
                value={construction.toLowerCase()}
              >
                {construction}
              </option>
            ))}
          </Form.Control>
          <Button
            variant="dark"
            disabled={!isFormFilled()}
            onClick={() => {
              save({
                address,
                price,
                ipfsImage,
                description,
                ownerAddress: address,
                attributes,
              });
            }}
          >
            Create NFT
          </Button>
        </Form>
      </div>
    </>
  );
};

export default Add;
