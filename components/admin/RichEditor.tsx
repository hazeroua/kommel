"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect, useState } from "react";
import type { RichNode } from "@/types";

interface RichEditorProps {
  name: string;
  initialContent?: RichNode | null;
}

export function RichEditor({ name, initialContent }: RichEditorProps) {
  // Tiptap v3 ne re-rend plus le composant à chaque frappe : on stocke le JSON
  // dans un état mis à jour par onUpdate, sinon le champ caché reste vide.
  const [json, setJson] = useState(initialContent ? JSON.stringify(initialContent) : "");
  const editor = useEditor({
    extensions: [StarterKit],
    content: initialContent ?? "",
    immediatelyRender: false,
    shouldRerenderOnTransaction: true,
    onCreate: ({ editor }) => setJson(JSON.stringify(editor.getJSON())),
    onUpdate: ({ editor }) => setJson(JSON.stringify(editor.getJSON())),
    editorProps: {
      attributes: {
        class:
          "prose prose-brun min-h-[300px] max-w-none focus:outline-none p-4",
      },
    },
  });

  // Update if initialContent changes (e.g. after load)
  useEffect(() => {
    if (editor && initialContent && editor.isEmpty) {
      editor.commands.setContent(initialContent);
    }
  }, [editor, initialContent]);


  return (
    <div className="rounded-card border-2 border-brun bg-blanc overflow-hidden">
      {/* Toolbar */}
      {editor && (
        <div className="flex flex-wrap gap-1 border-b-2 border-brun p-2 bg-creme/50">
          {[
            { label: "G", title: "Gras", action: () => editor.chain().focus().toggleBold().run(), active: editor.isActive("bold") },
            { label: "I", title: "Italique", action: () => editor.chain().focus().toggleItalic().run(), active: editor.isActive("italic") },
            { label: "H2", title: "Titre 2", action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(), active: editor.isActive("heading", { level: 2 }) },
            { label: "H3", title: "Titre 3", action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(), active: editor.isActive("heading", { level: 3 }) },
            { label: "• —", title: "Liste à puces", action: () => editor.chain().focus().toggleBulletList().run(), active: editor.isActive("bulletList") },
            { label: "1.", title: "Liste numérotée", action: () => editor.chain().focus().toggleOrderedList().run(), active: editor.isActive("orderedList") },
            { label: "❝", title: "Citation", action: () => editor.chain().focus().toggleBlockquote().run(), active: editor.isActive("blockquote") },
          ].map((btn) => (
            <button
              key={btn.label}
              type="button"
              title={btn.title}
              onMouseDown={(e) => { e.preventDefault(); btn.action(); }}
              className={`rounded px-2.5 py-1 text-sm font-bold transition ${btn.active ? "bg-brun text-blanc" : "hover:bg-brun/10"}`}
            >
              {btn.label}
            </button>
          ))}
          <div className="mx-1 w-px bg-brun/20" />
          <button
            type="button"
            title="Annuler"
            onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().undo().run(); }}
            className="rounded px-2.5 py-1 text-sm hover:bg-brun/10 disabled:opacity-30"
            disabled={!editor.can().undo()}
          >↩</button>
          <button
            type="button"
            title="Rétablir"
            onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().redo().run(); }}
            className="rounded px-2.5 py-1 text-sm hover:bg-brun/10 disabled:opacity-30"
            disabled={!editor.can().redo()}
          >↪</button>
        </div>
      )}
      <EditorContent editor={editor} />
      {/* Hidden input to submit content as JSON */}
      <input type="hidden" name={name} value={json} />
    </div>
  );
}
