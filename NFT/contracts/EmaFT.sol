// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Metadata.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "../utils/stringUtils.sol";

interface ERC721WithMeta is IERC721, IERC721Metadata {}
contract EmaFT is ERC721 {
    string private svgFormatFront1 = string(abi.encodePacked('<svg xmlns="http://www.w3.org/2000/svg" xml:space="preserve" viewBox="0 0 200 257.9422"><g transform="matrix(1.26057152 0 0 .78904079 -31.316713 -67.080117)"><path fill="#febe69" d="M25.972512 133.2503H183.50146l-4.49792 110.10088H30.470429Z"/><path fill="#febe69" d="m24.843274 134.379533 77.019894-49.364767 80.869535 48.56883Z"/><circle cx="102.19621" cy="101.63158" r="5" fill="#fff"/><text xml:space="preserve" x="57.973602" y="139.82329" stroke-width="1.00269" direction="rtl" font-family="Tamanegi_Geki" font-size="9.90435" font-weight="700" style="line-height:0;-inkscape-font-specification:&quot;Tamanegi_Geki, Bold&quot;;text-align:center;text-orientation:upright" text-anchor="middle" transform="scale(.79116302 1.263962)"><tspan x="57.973602" y="139.82329" writing-mode="tb-rl"> ',
    unicode'NF天満宮', '</tspan></text></g><text xml:space="preserve" fill="#280b0b" font-size="85.3333" style="white-space:pre;shape-inside:url(#a)" transform="matrix(.23610174 0 0 .24690367 243.622732 -4.098946)"><tspan x="-822.47852" y="181.80856"><tspan font-family="Tamanegi_Geki" style="-inkscape-font-specification:Tamanegi_Geki">',
    unicode'奉','</tspan></tspan></text><text xml:space="preserve" x="201.07938" y="186.18793" fill="#280b0b" stroke-width=".264583" font-family="sans-serif" font-size="8.46667" font-weight="700" style="-inkscape-font-specification:&quot;sans-serif Bold&quot;;text-orientation:upright" transform="translate(9.923507 -82.654231) scale(.83289259)"><tspan x="180.07938" y="186.18793" style="-inkscape-font-specification:&quot;sans-serif Bold&quot;;text-align:center" text-anchor="middle" writing-mode="tb-rl">'));
    string private svgFormatFront2 = string(abi.encodePacked(
    '</tspan></text><text xml:space="preserve" x="149.21829" y="146.19049" fill="#280b0b" stroke-width=".289883" font-family="Tamanegi_Geki" font-size="24.7369" font-weight="400" style="-inkscape-font-specification:Tamanegi_Geki" transform="matrix(.81446954 0 0 .85173237 9.923507 -82.654231)"><tspan x="149.21829" y="146.19049">',
    unicode'納', '</tspan></text><g transform="translate(30.904077 -29.758531) scale(.31245671)"><path fill="#303030" d="M155.851 306.732c-18.155 0-22.636-11.146-22.636-11.146l1.494 16.661h42.286l1.494-16.661c-.002.001-4.483 11.146-22.638 11.146z"/><path fill="#e81c1c" d="M148.49699 284.556h15.627v188.215h-15.627z"/><ellipse cx="156.31" cy="479.03299" fill="#191919" rx="19.304001" ry="6.952"/><path fill="#ff2c2c" d="M144.59 436.691v39.987c0 1.888 5.247 3.418 11.72 3.418 6.473 0 11.72-1.53 11.72-3.418v-39.987z"/></g><g transform="translate(30.904077 -29.758531) scale(.31245671)"><path fill="#e81c1c" d="M282.70599 284.556h15.627v188.215h-15.627zM218.359 312.248h10.112v-27.692h-10.112z"/><path fill="#ff2c2c" d="M104.373 286.394h238.084l4.137-13.329H100.236z"/><path fill="#303030" d="M290.98 306.732c18.155 0 22.636-11.146 22.636-11.146l-1.494 16.661h-42.285l-1.494-16.661c0 .001 4.482 11.146 22.637 11.146zm-67.565-44.212c-109.593 0-133.033-17.235-137.169-21.371l8.935 34.215H351.65l8.935-34.215c-4.137 4.136-27.576 21.371-137.17 21.371z"/><ellipse cx="290.51999" cy="479.03299" fill="#191919" rx="19.304001" ry="6.952"/><path fill="#ba1919" d="M110.654 322.321h225.522v-11.643H110.654z"/><path fill="#ff2c2c" d="M302.24 436.691v39.987c0 1.888-5.247 3.418-11.72 3.418-6.473 0-11.72-1.53-11.72-3.418v-39.987z"/></g>'));
    string private svgFormatBack1 = string(abi.encodePacked('<g transform="matrix(1.26057157 0 0 .7890415 -75.404294 234.704048)"><path fill="#febe69" d="M60.94678-80.649745h157.52895l-4.49792 110.10088H65.444697Z"/><path fill="#febe69" d="m59.817542-79.520509 77.019894-49.364767 80.869535 48.56883Z"/><circle cx="137.17049" cy="-112.26847" r="5" fill="#fff"/></g><text xml:space="preserve" x="209.95473" y="374.50323" stroke-width=".365001" font-family="Tamanegi_Geki" font-size="11.2889" font-weight="700" letter-spacing="3.96875" style="line-height:0;-inkscape-font-specification:&quot;Tamanegi_Geki Bold&quot;;text-align:center;text-orientation:upright" text-anchor="middle" transform="matrix(.89235306 0 0 .93318009 -89.609041 -177.833896)"><tspan x="211.9391" y="374.50323" stroke-width=".365">',
    unicode'令和五年', '</tspan></text><g transform="matrix(.89235306 0 0 .93318009 -87.394142 -174.33652)"><ellipse cx="120.62452" cy="445.47101" fill="none" stroke="red" stroke-width=".681042" rx="9.683998" ry="9.659479"/><text xml:space="preserve" x="120.16389" y="445.64499" fill="red" stroke-width=".365001" direction="rtl" font-family="Tamanegi_Geki" font-size="14.1111" font-weight="700" style="line-height:0;-inkscape-font-specification:&quot;Tamanegi_Geki, Bold&quot;;font-variant-ligatures:normal;font-variant-caps:normal;font-variant-numeric:normal;font-variant-east-asian:normal;text-align:center;text-orientation:upright" text-anchor="middle" writing-mode="tb-rl"><tspan x="120.16389" y="445.64499" stroke-width=".365">'));
    string private svgFormatBack2 = string(abi.encodePacked('</tspan></text></g><text xml:space="preserve" stroke-width="3.77953" direction="rtl" font-family="Tamanegi_Geki" font-size="43.8495" font-weight="700" style="line-height:1.1;-inkscape-font-specification:&quot;Tamanegi_Geki, Bold&quot;;font-variant-ligatures:normal;font-variant-caps:normal;font-variant-numeric:normal;font-variant-east-asian:normal;text-align:end;text-orientation:upright;white-space:pre;shape-inside:url(#b);shape-padding:0" transform="matrix(.23610174 0 0 .29585664 -129.361002 -261.060929)" writing-mode="tb-rl">'));
    string private svgFormatBack3 = '</text></svg>';

    using strings for *;
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;

    struct NFTInfo {
        string isAchievedGoal;
        string text;
        string name;
    }
    mapping(uint256 => NFTInfo) public NFTInfos;

    constructor() ERC721("EmaFT", "EFT") {}

    function mint(string memory text, address NFTaddress, uint256 SenderTokenId) public {
        ERC721WithMeta SenderNFT = ERC721WithMeta(NFTaddress);
        require(balanceOf(msg.sender) == 0, "This NFT is one per address");
        SenderNFT.transferFrom(msg.sender, address(this), SenderTokenId);
        require(SenderNFT.ownerOf(SenderTokenId) == address(this), "Transfer failed");
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(msg.sender, tokenId);
        NFTInfos[tokenId] = NFTInfo('', text, SenderNFT.name());
    }

    function setAchieved(uint256 tokenId) public {
        require(keccak256(abi.encodePacked(NFTInfos[tokenId].isAchievedGoal)) == keccak256(abi.encodePacked('')), "Already Achieved");
        NFTInfos[tokenId].isAchievedGoal = unicode'済';
    }

    // The following functions are overrides required by Solidity.

    function _beforeTokenTransfer(
            address from,
            address to,
            uint256, /* firstTokenId */
            uint256 batchSize
        ) internal pure override {
        require(from == address(0), "This NFT is not transferable");
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override
        returns (string memory)
    {
        return createSVG(tokenId);
    }

    // utilFuncs
    function createSVG(uint256 tokenId) private view returns(string memory) {
        string[] memory texts = stringToArray(NFTInfos[tokenId].text, '\n');
        bytes memory output;
        for (uint256 i = 0; i < texts.length; i++) {
            output = abi.encodePacked(output, string(abi.encodePacked('<tspan x="', Strings.toString((480 + 30 * (texts.length / 2)) - 30 * i), '%" y="1730">', texts[i], '</tspan>')));
        }
        return string(abi.encodePacked(
            svgFormatFront1,
            NFTInfos[tokenId].name,
            svgFormatFront2, 
            svgFormatBack1, 
            NFTInfos[tokenId].isAchievedGoal, 
            svgFormatBack2,
            output,
            svgFormatBack3
        ));
    }

    function stringToArray(string memory _strings, string memory splitter) private pure returns (string[] memory) {
        strings.slice memory slicee = _strings.toSlice();
        strings.slice memory delim =  splitter.toSlice();
        string[] memory parts = new string[](slicee.count(delim) + 1);
        for (uint i = 0; i < parts.length; i++) {
            parts[i] = slicee.split(delim).toString();
        }
        return parts;
    }
}