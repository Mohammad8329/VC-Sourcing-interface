'use client';

import { useState, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import { toast } from 'sonner';

export function NoteEditor({ companyId }: { companyId: string }) {
    const [note, setNote] = useState('');
    const storageKey = `vc-note-${companyId}`;

    useEffect(() => {
        const saved = localStorage.getItem(storageKey);
        if (saved) {
            setNote(saved);
        }
    }, [storageKey]);

    const handleSave = () => {
        localStorage.setItem(storageKey, note);
        toast.success('Notes saved successfully');
    };

    return (
        <div className="flex flex-col gap-3">
            <Textarea
                placeholder="Add your thesis, meeting notes, or red flags..."
                className="min-h-[150px] resize-none border-muted bg-muted/30 focus-visible:bg-background"
                value={note}
                onChange={(e) => setNote(e.target.value)}
            />
            <div className="flex justify-end">
                <Button size="sm" onClick={handleSave} className="gap-2">
                    <Save size={16} /> Save Notes
                </Button>
            </div>
        </div>
    );
}
