import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AcceptCase() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.profile);
  const [cases, setCases] = useState({
    pending: [],
    accepted: [],
    completed: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.accountType !== "Provider") {
      toast.error("Only providers can access this page");
      navigate("/dashboard");
    } else {
      fetchAllCases();
    }
  }, [user, navigate]);

  const fetchAllCases = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/case/getAllCases`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const data = await response.json();
      if (data.success) {
        // Categorize cases by status
        const categorizedCases = {
          pending: data.cases.filter(c => c.status === "Pending"),
          accepted: data.cases.filter(c => c.status === "Accepted"),
          completed: data.cases.filter(c => c.status === "Completed")
        };
        setCases(categorizedCases);
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error("Error fetching cases:", error);
      toast.error("Failed to fetch cases");
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptCase = async (caseId) => {
    const toastId = toast.loading("Accepting case...");
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/case/acceptCase`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ caseId }),
        }
      );

      const data = await response.json();
      if (data.success) {
        toast.success("Case accepted successfully");
        // Refresh cases after accepting
        fetchAllCases();
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error("Error accepting case:", error);
      toast.error(error.message || "Failed to accept case");
    } finally {
      toast.dismiss(toastId);
    }
  };

  const handleUpdateStatus = async (caseId, newStatus) => {
    const toastId = toast.loading("Updating status...");
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/case/updateStatus`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ caseId, status: newStatus }),
        }
      );

      const data = await response.json();
      if (data.success) {
        toast.success("Status updated successfully");
        fetchAllCases();
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error(error.message || "Failed to update status");
    } finally {
      toast.dismiss(toastId);
    }
  };

  const CaseCard = ({ case_ }) => (
    <Card className="mb-4">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl">Case #{case_._id.slice(-6)}</CardTitle>
          <Badge 
            variant={
              case_.status === "Pending" ? "secondary" :
              case_.status === "Accepted" ? "default" :
              "success"
            }
          >
            {case_.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold">Description</h3>
            <p className="text-gray-600">{case_.description}</p>
          </div>

          <div>
            <h3 className="font-semibold">Client Details</h3>
            <p className="text-gray-600">
              {case_.client?.firstName} {case_.client?.lastName}
            </p>
          </div>

          {case_.caseDocument && (
            <div>
              <h3 className="font-semibold">Documents</h3>
              <a
                href={case_.caseDocument}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                View Document
              </a>
            </div>
          )}

          {case_.caseAudio && (
            <div>
              <h3 className="font-semibold">Audio Recording</h3>
              <audio controls className="w-full mt-2">
                <source src={case_.caseAudio} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
            </div>
          )}

          <div className="flex gap-2 mt-4">
            {case_.status === "Pending" && (
              <Button 
                onClick={() => handleAcceptCase(case_._id)}
                className="bg-primary text-white"
              >
                Accept Case
              </Button>
            )}
            {case_.status === "Accepted" && (
              <Button 
                onClick={() => handleUpdateStatus(case_._id, "Completed")}
                variant="outline"
              >
                Mark as Completed
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-6 mt-14">
      <h1 className="text-4xl mb-6 mt-10 tracking-tighter font-semibold">
        Case Management
      </h1>

      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pending">
            Pending ({cases.pending.length})
          </TabsTrigger>
          <TabsTrigger value="accepted">
            Accepted ({cases.accepted.length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed ({cases.completed.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending">
          {cases.pending.length === 0 ? (
            <p className="text-center py-4">No pending cases</p>
          ) : (
            cases.pending.map(case_ => (
              <CaseCard key={case_._id} case_={case_} />
            ))
          )}
        </TabsContent>

        <TabsContent value="accepted">
          {cases.accepted.length === 0 ? (
            <p className="text-center py-4">No accepted cases</p>
          ) : (
            cases.accepted.map(case_ => (
              <CaseCard key={case_._id} case_={case_} />
            ))
          )}
        </TabsContent>

        <TabsContent value="completed">
          {cases.completed.length === 0 ? (
            <p className="text-center py-4">No completed cases</p>
          ) : (
            cases.completed.map(case_ => (
              <CaseCard key={case_._id} case_={case_} />
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}