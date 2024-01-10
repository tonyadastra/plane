import { Editor, isAtStartOfNode, isNodeActive } from "@tiptap/core";
import { Node } from "@tiptap/pm/model";
import { EditorState } from "@tiptap/pm/state";
import { Anchor } from "lucide-react";

import { findListItemPos } from "src/ui/extensions/custom-list-keymap/list-helpers/find-list-item-pos";
import { hasListBefore } from "src/ui/extensions/custom-list-keymap/list-helpers/has-list-before";

export const handleBackspace = (
  editor: Editor,
  name: string,
  parentListTypes: string[],
  blockquoteName = "blockquote"
) => {
  // this is required to still handle the undo handling
  const { tr } = editor.state;
  if (editor.commands.undoInputRule()) {
    return true;
  }

  const { $anchor } = editor.state.selection;
  // __AUTO_GENERATED_PRINT_VAR_START__
  console.log("handleBackspace $anchor: %s", $anchor.pos); // __AUTO_GENERATED_PRINT_VAR_END__
  // if the cursor is not at the start of a node
  // do nothing and proceed
  if (!isAtStartOfNode(editor.state)) {
    return false;
  }

  const $beforePos = editor.state.doc.resolve($anchor.before());

  // Check if the node before the current position is a blockquote
  const beforeNode = $beforePos.nodeBefore;
  // if (beforeNode && beforeNode.type.name === "blockquote") {
  //   // Find the last child of the blockquote, which should be a paragraph
  //   const lastChild = beforeNode.lastChild;
  //
  //   if (lastChild && lastChild.type.name === "paragraph") {
  //     // Calculate the position at the end of the last paragraph inside the blockquote
  //     // We use the resolved position of the blockquote ($beforePos.pos), subtract the size of the blockquote closing tag,
  //     // and then subtract the size of the last paragraph's closing tag to get the position at the end of the last paragraph's content
  //     const endOfLastParagraphInBlockquote = $beforePos.pos - 1;
  //
  //     // Start a ProseMirror transaction
  //     tr.deleteRange($anchor.pos, $anchor.pos + 1) // Delete "s"
  //       .join(endOfLastParagraphInBlockquote); // Join the paragraph with the last paragraph of the blockquote
  //
  //     // Check if the transaction can be applied
  //     if (tr.docChanged) {
  //       // Apply the transaction
  //       editor.view.dispatch(tr);
  //       return true;
  //     }
  //   }
  // }

  if (beforeNode && beforeNode.type.name === "blockquote") {
    // Find the last child of the blockquote, which should be a paragraph
    const lastChild = beforeNode.lastChild;

    if (lastChild && lastChild.type.name === "paragraph") {
      // Calculate the position at the end of the last paragraph inside the blockquote
      // We use the position of the start of the blockquote node ($beforePos.start()) and add the size of its content

      const endOfLastParagraphInBlockquote = $beforePos.pos - lastChild.nodeSize + lastChild.content.size;
      // __AUTO_GENERATED_PRINT_VAR_START__
      console.log("handleBackspace#if#if beforeNode start: %s", $beforePos.start()); // __AUTO_GENERATED_PRINT_VAR_END__
      // __AUTO_GENERATED_PRINT_VAR_START__
      console.log("handleBackspace#if#if beforeNode content size: %s", beforeNode.content.size); // __AUTO_GENERATED_PRINT_VAR_END__
      // __AUTO_GENERATED_PRINT_VAR_START__
      console.log("handleBackspace#if#if endOfLastParagraphInBlockquote: %s", endOfLastParagraphInBlockquote); // __AUTO_GENERATED_PRINT_VAR_END__

      // Move the content of the current paragraph into the last paragraph of the blockquote
      return editor
        .chain()
        .deleteRange({ from: $anchor.pos - 1, to: $anchor.pos }) // Delete "s"
        .setTextSelection(endOfLastParagraphInBlockquote) // Set selection to the end of the paragraph inside the blockquote
        .command(({ tr, dispatch }) => {
          if (dispatch) {
            // Join the current paragraph with the last paragraph of the blockquote
            tr.join(endOfLastParagraphInBlockquote - 1);
          }
          return true;
        })
        .run();
    }
  }

  // if the current item is NOT inside a list item &
  // the previous item is a list (orderedList or bulletList)
  // move the cursor into the list and delete the current item
  if (!isNodeActive(editor.state, name) && hasListBefore(editor.state, name, parentListTypes)) {
    const { $anchor } = editor.state.selection;

    const $listPos = editor.state.doc.resolve($anchor.before() - 1);

    const listDescendants: Array<{ node: Node; pos: number }> = [];

    $listPos.node().descendants((node, pos) => {
      if (node.type.name === name) {
        listDescendants.push({ node, pos });
      }
    });

    const lastItem = listDescendants.at(-1);

    if (!lastItem) {
      return false;
    }

    const $lastItemPos = editor.state.doc.resolve($listPos.start() + lastItem.pos + 1);

    return editor
      .chain()
      .cut({ from: $anchor.start() - 1, to: $anchor.end() + 1 }, $lastItemPos.end())
      .joinForward()
      .run();
  }

  // if the cursor is not inside the current node type
  // do nothing and proceed
  if (!isNodeActive(editor.state, name)) {
    return false;
  }

  const listItemPos = findListItemPos(name, editor.state);

  if (!listItemPos) {
    return false;
  }

  // if current node is a list item and cursor it at start of a list node,
  // simply lift the list item i.e. remove it as a list item (task/bullet/ordered)
  // irrespective of above node being a list or not
  return editor.chain().liftListItem(name).run();
};

export const hasBlockquoteBefore = (editorState: EditorState, blockquoteName = "blockquote") => {
  const { $anchor } = editorState.selection;
  const $beforePos = editorState.doc.resolve($anchor.before());

  let hasBlockquote = false;
  editorState.doc.nodesBetween(0, $beforePos.pos, (node) => {
    if (node.type.name === blockquoteName) {
      hasBlockquote = true;
    }
  });

  return hasBlockquote;
};
