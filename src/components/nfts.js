import React, { useState, useEffect, useCallback } from "react";
import { NotificationSuccess, NotificationError } from "./ui/Notifications";

import {
  createLand,
  getLands,
  buyLand,
  fetchNftContractOwner,
  sellLand,
} from "../utils/minter";
import { Badge, Card, Stack, Row, Col } from "react-bootstrap";
import { useContractKit } from "@celo-tools/use-contractkit";
import { toast } from "react-toastify";

import Loader from "./ui/Loader";
import Add from "./Add";
import Identicon from "./ui/Identicon";
import { truncateAddress } from "../utils";

const Nft = ({ minterContract }) => {
  const [loading, setLoading] = useState(false);
  const [nfts, setNfts] = useState([]);
  const { performActions, address, kit } = useContractKit();
  const [nftOwner, setNftOwner] = useState(null);
  const { defaultAccount } = kit;

  const fetchContractOwner = useCallback(async (minterContract) => {
    // get the address that deployed the NFT contract
    const _address = await fetchNftContractOwner(minterContract);
    setNftOwner(_address);
  }, []);

  const getAssets = useCallback(async () => {
    try {
      setLoading(true);

      // fetch all nfts from the smart contract
      const allNfts = await getLands(minterContract);
      if (!allNfts) return;
      setNfts(allNfts);
    } catch (error) {
      console.log({ error });
    } finally {
      setLoading(false);
    }
  }, [minterContract]);

  const addNft = async (data) => {
    try {
      setLoading(true);

      // create an nft functionality
      await createLand(minterContract, performActions, data);
      toast(<NotificationSuccess text="Updating NFT list...." />);
      getAssets();
    } catch (error) {
      console.log({ error });
      toast(<NotificationError text="Failed to create an NFT." />);
    } finally {
      setLoading(false);
    }
  };

  const buy = async (index, tokenId) => {
    try {
      setLoading(true);
      await buyLand(minterContract, index, tokenId, performActions);
      toast(<NotificationSuccess text="Updating NFT list...." />);
      getAssets();
    } catch (error) {
      console.log(error);
      toast(<NotificationError text="Failed to send NFT." />);
    } finally {
      setLoading(false);
    }
  };

  const sell = async (index) => {
    try {
      setLoading(true);
      await sellLand(minterContract, index, performActions);
      toast(<NotificationSuccess text="Updating NFT list...." />);
      getAssets();
    } catch (error) {
      console.log(error);
      toast(<NotificationError text="Failed to send NFT." />);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    try {
      if (address && minterContract) {
        getAssets();
        fetchContractOwner(minterContract);
      }
    } catch (error) {
      console.log({ error });
    }
  }, [minterContract, address, getAssets, fetchContractOwner]);
  if (address) {
    return (
      <>
        {!loading ? (
          <>
            <div>
              <main>
                <section className="py-5 text-center container">
                  <div className="row py-lg-5">
                    <div className="col-lg-6 col-md-8 mx-auto">
                      <h1 className="fw-light">We bring Land to Life</h1>
                      <p className="lead text-muted">
                        Join us in this exciting journey to make lands
                        accessible to all around the world{" "}
                      </p>
                    </div>
                  </div>
                </section>
                <div className="album py-5 bg-light">
                  <div className="container">
                    <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
                      {nfts.map((_nft) => (
                        <div className="col">
                          <div className="card shadow-sm">
                            <Card.Header>
                              <Stack direction="horizontal" gap={2}>
                                <Identicon address={_nft.owner} size={28} />
                                <span className="font-monospace text-secondary">
                                  {truncateAddress(_nft.owner)}
                                </span>
                                <Badge bg="secondary" className="ms-auto">
                                  {_nft.price / 10 ** 18} CELO
                                </Badge>
                              </Stack>
                            </Card.Header>
                            <img src={_nft.image} alt="" />
                            <div className="card-body">
                              <p className="card-text">{_nft.address}</p>
                              <p className="card-text">{_nft.description}</p>
                              <Row className="mt-2 mb-2">
                                {_nft.attributes.map((attribute, key) => (
                                  <Col key={key}>
                                    <div className="border rounded bg-light">
                                      <div className="text-secondary fw-lighter small text-capitalize">
                                        {attribute.trait_type}
                                      </div>
                                      <div className="text-secondary text-capitalize font-monospace">
                                        {attribute.value}
                                      </div>
                                    </div>
                                  </Col>
                                ))}
                              </Row>
                              <div className="d-flex justify-content-between align-items-center">
                                <div className="btn-group">
                                  {!_nft.sold ? (
                                    <button
                                      type="button"
                                      className="btn btn-outline-primary"
                                      onClick={() =>
                                        buy(_nft.index, _nft.tokenId)
                                      }
                                    >
                                      Buy
                                    </button>
                                  ) : defaultAccount === _nft.owner ? (
                                    <button
                                      type="button"
                                      className="btn btn-outline-danger"
                                      onClick={() => sell(_nft.index)}
                                    >
                                      Sell
                                    </button>
                                  ) : (
                                    <button
                                      type="button"
                                      disabled
                                      className="btn"
                                    >
                                      Land is sold
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </main>
            </div>
            <Add save={addNft} />
          </>
        ) : (
          <Loader />
        )}
      </>
    );
  }
  return null;
};

export default Nft;
