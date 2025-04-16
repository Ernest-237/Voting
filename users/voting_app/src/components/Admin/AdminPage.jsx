import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import MonetbilSyncUtility from './MonetbilSyncUtility';

const AdminPage = () => {
  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="container mx-auto">
        <h1 className="text-2xl font-bold mb-6">Administration Miss & Master HITBAMAS</h1>
        
        <Tabs defaultValue="candidates">
          <TabsList className="mb-6">
            <TabsTrigger value="candidates">Candidats</TabsTrigger>
            <TabsTrigger value="votes">Votes</TabsTrigger>
            <TabsTrigger value="sync">Synchronisation</TabsTrigger>
          </TabsList>
          
          <TabsContent value="candidates">
            {/* Your candidates management UI */}
            <p>Gestion des candidats...</p>
          </TabsContent>
          
          <TabsContent value="votes">
            {/* Your votes management UI */}
            <p>Gestion des votes...</p>
          </TabsContent>
          
          <TabsContent value="sync">
            <MonetbilSyncUtility />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPage;