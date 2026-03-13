// components/signature/SignatureSidebar.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Signature, PenTool, Type, CheckCircle2 } from 'lucide-react';
import SignaturePad from 'react-signature-canvas';
import { useRef } from 'react';

// You'll inject the selected signature into the editor via this callback
type ApplySignatureHandler = (signatureDataUrl: string) => void;

export default function SignatureSidebar({
  onApplySignature,
}: { onApplySignature: ApplySignatureHandler }) {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('draw');
  const [typedName, setTypedName] = useState('');
  const sigPadRef = useRef<SignaturePad | null>(null);

  const [savedSignatures] = useState<string[]>([
    // Dummy saved signatures (data URLs)
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAlgAAAGQCAYAAA...',
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAlgAAAGQCAYAAA...',
  ]);

  const clearPad = () => sigPadRef.current?.clear();
  const getSignatureData = () =>
    sigPadRef.current?.getTrimmedCanvas().toDataURL('image/png');

  const handleApply = () => {
    let signatureUrl = '';

    if (
      activeTab === 'draw' &&
      sigPadRef.current &&
      !sigPadRef.current.isEmpty()
    ) {
      signatureUrl = getSignatureData()!;
    } else if (activeTab === 'type' && typedName.trim()) {
      const canvas = document.createElement('canvas');
      canvas.width = 400;
      canvas.height = 150;
      const ctx = canvas.getContext('2d')!;
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = 'italic 80px cursive';
      ctx.fillStyle = '#1e40af';
      ctx.fillText(typedName.trim(), 20, 100);
      signatureUrl = canvas.toDataURL('image/png');
    } else if (activeTab === 'saved') {
      // Use first saved for demo
      signatureUrl = savedSignatures[0];
    }

    if (signatureUrl) {
      onApplySignature(signatureUrl);
      setOpen(false);
      clearPad();
      setTypedName('');
    }
  };

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setOpen(true)}
              className="gap-2"
            >
              <Signature className="h-4 w-4" />
              <span className="hidden sm:inline">My Signature</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Add your signature</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right" className="w-full sm:max-w-lg">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-3 text-xl">
              <Signature className="h-6 w-6" />
              Add Your Signature
            </SheetTitle>
          </SheetHeader>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="draw">
                <PenTool className="h-4 w-4 mr-2" />
                Draw
              </TabsTrigger>
              <TabsTrigger value="type">
                <Type className="h-4 w-4 mr-2" />
                Type
              </TabsTrigger>
              <TabsTrigger value="saved">
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Saved
              </TabsTrigger>
            </TabsList>

            <TabsContent value="draw" className="mt-6">
              <div className="space-y-4">
                <div className="border-2 border-dashed rounded-xl bg-gray-50">
                  <SignaturePad
                    ref={sigPadRef}
                    canvasProps={{
                      className: 'w-full h-64 rounded-lg',
                    }}
                  />
                </div>
                <div className="flex justify-between">
                  <Button variant="outline" onClick={clearPad}>
                    Clear
                  </Button>
                  <Button
                    onClick={handleApply}
                    disabled={!sigPadRef.current || sigPadRef.current.isEmpty()}
                  >
                    Apply Signature
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="type" className="mt-6 space-y-6">
              <div>
                <label className="text-sm font-medium">Type your name</label>
                <input
                  type="text"
                  value={typedName}
                  onChange={(e) => setTypedName(e.target.value)}
                  placeholder="John Doe"
                  className="mt-2 w-full rounded-md border px-4 py-3 text-2xl font-cursive focus:outline-none focus:ring-2 focus:ring-blue-500"
                  style={{ fontFamily: 'cursive' }}
                />
              </div>

              {typedName && (
                <div className="rounded-lg border bg-white p-6">
                  <p
                    className="text-4xl"
                    style={{ fontFamily: 'cursive', color: '#1e40af' }}
                  >
                    {typedName}
                  </p>
                </div>
              )}

              <Button
                className="w-full"
                size="lg"
                onClick={handleApply}
                disabled={!typedName.trim()}
              >
                Use This Signature
              </Button>
            </TabsContent>

            <TabsContent value="saved" className="mt-6">
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Your saved signatures
                </p>
                <div className="grid grid-cols-2 gap-4">
                  {savedSignatures.length > 0 ? (
                    savedSignatures.map((sig, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          onApplySignature(sig);
                          setOpen(false);
                        }}
                        className="rounded-lg border-2 border-dashed p-6 hover:border-blue-500 transition-all"
                      >
                        <img
                          src={sig}
                          alt="Saved signature"
                          className="w-full"
                        />
                      </button>
                    ))
                  ) : (
                    <p className="col-span-2 text-center text-muted-foreground">
                      No saved signatures yet
                    </p>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </SheetContent>
      </Sheet>
    </>
  );
}
