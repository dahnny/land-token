// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract LandNFT is ERC721, ERC721Enumerable, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;

    constructor() ERC721("Lander", "LAND") {}

    uint256 owners = 0;

    struct Land {
        uint256 tokenId;
        address payable seller;
        address payable owner;
        uint256 price;
        bool sold;
    }

    mapping(uint256 => Land) private lands;

    function safeMint(string memory uri, uint256 price)
        public
        payable
        returns (uint256)
    {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _mint(msg.sender, tokenId);

        _setTokenURI(tokenId, uri);
        createLand(tokenId, price);

        return tokenId;
    }

    function createLand(uint256 tokenId, uint256 price) private {
        require(price > 0, "Price must be at least 1 wei");
        lands[tokenId] = Land(
            tokenId,
            payable(msg.sender),
            payable(address(this)),
            price,
            false
        );

        _transfer(msg.sender, address(this), tokenId);
    }

    function buyLand(uint256 tokenId) public payable {
        uint256 price = lands[tokenId].price;
        address seller = lands[tokenId].seller;
        require(
            msg.value >= price,
            "Please submit the asking price in order to buy this land"
        );
        lands[tokenId].owner = payable(msg.sender);
        lands[tokenId].sold = true;
        lands[tokenId].seller = payable(address(0));
        _transfer(address(this), msg.sender, tokenId);

        payable(seller).transfer(msg.value);
    }

    function sellLand(uint256 tokenId) public payable {
        require(
            lands[tokenId].owner == msg.sender,
            "Only item owner can perform this operation"
        );
        lands[tokenId].sold = false;
        lands[tokenId].seller = payable(msg.sender);
        lands[tokenId].owner = payable(address(this));

        _transfer(msg.sender, address(this), tokenId);
    }

    function getLand(uint256 tokenId) public view returns (Land memory) {
        return lands[tokenId];
    }

    function getLandLength() public view returns (uint256) {
        return _tokenIdCounter.current();
    }


    // The following functions are overrides required by Solidity.

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal override(ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function _burn(uint256 tokenId)
        internal
        override(ERC721, ERC721URIStorage)
    {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
